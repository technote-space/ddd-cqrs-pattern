import type IDatabase from '$/server/shared/database';
import type {
  DatabaseRecord,
  SearchParams,
  Table,
  CreateTableParam,
  TableColumn,
  CreateData,
  UpdateData,
} from '$/server/shared/database';
import type IEnv from '$/server/shared/env';
import type {
  CreatePageParameters,
  ListBlockChildrenResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import type { MigrationSchemas } from '^/usecase/migration/databaseMigrationUseCase';
import { Client, APIErrorCode, LogLevel } from '@notionhq/client';
import { APIResponseError } from '@notionhq/client/build/src/errors';
import { singleton, inject } from 'tsyringe';
import InvalidUsage from '$/shared/exceptions/domain/invalidUsage';
import Factory from './property/factory';

export type QueryDatabaseResponseProperty<T = QueryDatabaseResponse['results'][number]> = T extends { properties: Record<string, infer U> } ? U : never;

@singleton()
export default class NotionDatabase implements IDatabase {
  private static $cache?: Table[];
  private _client?: Client;
  private _factory?: Factory;

  public constructor(
    @inject('MigrationSchemas') private schemas: MigrationSchemas,
    @inject('IEnv') private env: IEnv,
  ) {
  }

  private get client(): Client {
    if (!this._client) {
      this._client = new Client({
        auth: this.env.getValue('NOTION_SECRET'),
        baseUrl: this.env.getValue('NOTION_BASE_URL'),
        logLevel: LogLevel.ERROR,
      });
    }

    return this._client;
  }

  private get factory(): Factory {
    if (!this._factory) {
      this._factory = new Factory(this);
    }

    return this._factory;
  }

  private static filterNotUndefined<T>(item: T | undefined): item is T {
    return item !== undefined;
  }

  public async listTables(): Promise<Table[]> {
    if (!NotionDatabase.$cache) {
      const schemas: Record<string, CreateTableParam> = Object.assign({}, ...this.schemas.map(schema => ({ [schema.table]: schema })));
      const response = await this.client.blocks.children.list({
        block_id: this.env.getValue('NOTION_PARENT_ID'),
      });
      type DatabaseType = {
        type: 'child_database';
        child_database: {
          title: string;
        };
        object: 'block';
        id: string;
        created_time: string;
        last_edited_time: string;
        has_children: boolean;
        archived: boolean;
      };
      const filterDatabase = (result: ListBlockChildrenResponse['results'][number]): result is DatabaseType => 'type' in result && result.type === 'child_database';

      NotionDatabase.$cache = await response.results.filter(filterDatabase).filter(result => result.child_database.title in schemas).reduce(async (prev, result) => {
        const acc = await prev;
        const database = await this.client.databases.retrieve({ database_id: result.id });
        const schema = schemas[result.child_database.title];

        return acc.concat({
          id: result.id,
          table: schema.table,
          columns: [{
            id: 'id',
            name: 'id',
            type: 'pk',
          } as TableColumn].concat(...Object.values(database.properties).map(property => this.factory.getProperty(property.type).propertyToColumn(property, schema.columns)).filter(NotionDatabase.filterNotUndefined)),
        });
      }, Promise.resolve([] as Table[]));
    }

    return NotionDatabase.$cache;
  }

  public async getTable(value: string, key: keyof Table = 'table'): Promise<Table> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.listTables()).find(t => t[key] === value)!;
  }

  protected async getTableById(name: string): Promise<Table> {
    return this.getTable(name, 'id');
  }

  public async createTable(table: string): Promise<Table> {
    const tables = await this.listTables();
    const found = tables.find(t => t.table === table);
    if (found) {
      return found;
    }

    const schema = this.schemas.find(schema => schema.table === table);
    if (!schema) {
      throw new InvalidUsage(`schema????????????????????????: ${table}`);
    }

    const response = await this.client.databases.create({
      parent: {
        type: 'page_id',
        page_id: this.env.getValue('NOTION_PARENT_ID'),
      },
      title: [{
        type: 'text',
        text: {
          content: table,
          link: null,
        },
      }],
      properties: Object.assign({}, ...schema.columns.map(column => ({
        [column.name]: this.factory.getPropertyByColumn(column.type).columnToProperty(column, tables),
      }))),
    });

    NotionDatabase.$cache = undefined;
    return {
      id: response.id,
      table: schema.table,
      columns: Object.values(response.properties).map(property => this.factory.getProperty(property.type).propertyToColumn(property, schema.columns)).filter(NotionDatabase.filterNotUndefined),
    };
  }

  private static buildSearchFilter(params: SearchParams): QueryDatabaseParameters['filter'] {
    const filter = params.filter;
    if (!filter?.length) {
      return undefined;
    }

    return {
      [params.type ?? 'and']: filter.map(({ property, condition }) => {
        if ('int' in condition) {
          return { property, number: condition.int };
        }

        if ('datetime' in condition) {
          const { past_week, past_month, past_year, next_week, next_month, next_year, ...rest } = condition.datetime;
          /* istanbul ignore next */
          const convert = (flag: boolean | undefined, name: string) => flag ? { [name]: {} } : {};
          return {
            property,
            date: {
              ...rest,
              ...convert(past_week, 'past_week'),
              ...convert(past_month, 'past_month'),
              ...convert(past_year, 'past_year'),
              ...convert(next_week, 'next_week'),
              ...convert(next_month, 'next_month'),
              ...convert(next_year, 'next_year'),
            },
          };
        }

        return { property, ...condition };
      }),
    } as QueryDatabaseParameters['filter'];
  }

  private static buildSearchSorts(params: SearchParams): QueryDatabaseParameters['sorts'] {
    if (!params.sort) {
      return undefined;
    }

    return [{
      property: params.sort.column,
      direction: params.sort.direction,
    }];
  }

  private static buildSearchPagination(params: SearchParams): Pick<QueryDatabaseParameters, 'page_size' | 'start_cursor'> {
    return {
      page_size: params.pageSize,
      start_cursor: params.cursor,
    };
  }

  private async lazyLoadForTable(tableInfo: Table, table: Table, column: string, ids: string[]): Promise<Record<string, string>> {
    const response = await this.client.databases.query({
      database_id: table.id,
      filter: {
        or: ids.map(id => ({
          property: `Related to ${tableInfo.table} (${column})`,
          type: 'relation',
          relation: {
            contains: id,
          },
        })),
      },
    });

    /* istanbul ignore next */
    if (!response.results.length || !('properties' in response.results[0])) {
      /* istanbul ignore next */
      return {};
    }
    const properties = response.results[0].properties;

    type TitleType = {
      type: 'title';
      title: {
        plain_text: string;
      }[];
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const title = Object.keys(properties).find(name => properties[name].type === 'title')!;
    return Object.fromEntries(response.results.map(result => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return [result.id, ((result as any).properties[title] as TitleType).title[0].plain_text];
    }));
  }

  private async lazyLoadForResults(tableInfo: Table, results: QueryDatabaseResponse['results']): Promise<Record<string, Record<string, string>>> {
    type RelationType = {
      id: string;
      name: string;
      type: 'relation';
      relation_id: string;
      multiple: boolean;
      aggregates: boolean;
    }
    const filterRelation = (column: TableColumn): column is RelationType => column.type === 'relation';

    return Object.assign({}, ...await tableInfo.columns.filter(filterRelation).reduce(async (prev, column) => {
      const acc = await prev;
      const table = await this.getTableById(column.relation_id);
      const ids = results.map(result => result.id);
      return acc.concat({ [column.name]: await this.lazyLoadForTable(tableInfo, table, column.name, ids) });
    }, Promise.resolve([] as Record<string, Record<string, string>>[])));
  }

  private parseResultProperties<T extends DatabaseRecord>(result: QueryDatabaseResponse['results'][number], columns: TableColumn[], lazyLoading: Record<string, Record<string, string>>): T {
    return {
      ...Object.fromEntries(columns.map(column => {
        if (!('properties' in result) || !(column.name in result.properties)) {
          return [column.name, null];
        }

        const property = result.properties[column.name];
        return [column.name, this.factory.getProperty(property.type).toResultValue(property, column, lazyLoading)];
      })),
      id: result.id,
    } as T;
  }

  public async search<T extends DatabaseRecord>(table: string, params: SearchParams): Promise<{ results: T[]; hasMore: boolean; cursor: string | null }> {
    const tableInfo = await this.getTable(table);
    const {
      results,
      has_more,
      next_cursor,
    } = await this.client.databases.query({
      database_id: tableInfo.id,
      ...NotionDatabase.buildSearchPagination(params),
      filter: NotionDatabase.buildSearchFilter(params),
      sorts: NotionDatabase.buildSearchSorts(params),
    });

    const lazyLoading = await this.lazyLoadForResults(tableInfo, results);
    return {
      results: results.map(result => this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading)),
      hasMore: has_more,
      cursor: next_cursor,
    };
  }

  public async find<T extends DatabaseRecord>(table: string, id: string): Promise<T | null> {
    if (!id) {
      return null;
    }

    const tableInfo = await this.getTable(table);
    try {
      const result = await this.client.pages.retrieve({ page_id: id });
      const lazyLoading = await this.lazyLoadForResults(tableInfo, [result]);
      return this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading);
    } catch (error) {
      return null;
    }
  }

  private async getUpdateProperties(table: Table, data: CreateData) {
    return Object.fromEntries(
      await table.columns
        .filter(column => column.type !== 'pk' && column.name in data)
        .reduce(async (prev, column) => {
          const acc = await prev;
          return acc.concat([[column.name, await this.factory.getPropertyByColumn(column.type).toPropertyValue(data, column)]]);
        }, Promise.resolve([] as [string, CreatePageParameters['properties']][])),
    );
  }

  public async create<T extends DatabaseRecord>(table: string, data: CreateData): Promise<T> {
    const tableInfo = await this.getTable(table);
    const result = await this.client.pages.create({
      parent: {
        database_id: tableInfo.id,
      },
      properties: await this.getUpdateProperties(tableInfo, data),
    } as CreatePageParameters);

    const lazyLoading = await this.lazyLoadForResults(tableInfo, [result]);
    return this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading);
  }

  public async update<T extends DatabaseRecord>(table: string, data: UpdateData): Promise<T> {
    const tableInfo = await this.getTable(table);
    const result = await this.client.pages.update({
      page_id: data.id,
      properties: await this.getUpdateProperties(tableInfo, data),
    } as UpdatePageParameters);

    const lazyLoading = await this.lazyLoadForResults(tableInfo, [result]);
    return this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading);
  }

  public async delete(table: string, id: string): Promise<boolean> {
    if (!id) {
      return false;
    }

    try {
      await this.client.blocks.delete({
        block_id: id,
      });
      return true;
    } catch (error) {
      if (APIResponseError.isAPIResponseError(error) && error.code === APIErrorCode.ObjectNotFound) {
        return false;
      }

      throw error;
    }
  }
}
