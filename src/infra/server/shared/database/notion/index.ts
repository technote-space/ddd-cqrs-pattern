import type IDatabase from '$/server/shared/database';
import type { DatabaseRecord, SearchParams } from '$/server/shared/database';
import type { Table, CreateTableParam, TableColumn } from '$/server/shared/database';
import type IEnv from '$/server/shared/env';
import type {
  ListBlockChildrenResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { Client } from '@notionhq/client';
import { LogLevel } from '@notionhq/client/build/src';
import { singleton, inject } from 'tsyringe';
import Factory from './property/factory';

@singleton()
export default class NotionDatabase<T extends DatabaseRecord> implements IDatabase<T> {
  private static $cache: Table[];
  private client: Client;
  private factory: Factory;

  public constructor(
    @inject('MigrationSchemas') private schemas: MigrationSchemas,
    @inject('IEnv') private env: IEnv,
  ) {
    this.client = new Client({
      auth: this.env.getValue('NOTION_SECRET'),
      baseUrl: this.env.getValue('NOTION_BASE_URL'),
      logLevel: LogLevel.ERROR,
    });
    this.factory = new Factory();
  }

  public async listTables(): Promise<Table[]> {
    if (!NotionDatabase.$cache) {
      const schemas: Record<string, CreateTableParam> = Object.assign({}, ...this.schemas.map(schema => ({ [schema.name]: schema })));
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
      const filterDatabase = (result: ListBlockChildrenResponse['results'][number]): result is DatabaseType => result.type === 'child_database';

      NotionDatabase.$cache = await response.results.filter(filterDatabase).filter(result => result.child_database.title in schemas).reduce(async (prev, result) => {
        const acc = await prev;
        const database = await this.client.databases.retrieve({ database_id: result.id });
        const schema = schemas[result.child_database.title];

        return acc.concat({
          id: result.id,
          table: schema.table,
          name: result.child_database.title,
          columns: [{
            id: 'id',
            name: 'id',
            type: 'pk',
          } as TableColumn].concat(...Object.values(database.properties).map(property => this.factory.getProperty(property.type).propertyToColumn(property, schema.columns))),
        });
      }, Promise.resolve([] as Table[]));
    }

    return NotionDatabase.$cache;
  }

  protected async getTable(table: string): Promise<Table> {
    return (await this.listTables()).find(t => t.table === table)!;
  }

  protected async getTableByName(name: string): Promise<Table> {
    return (await this.listTables()).find(t => t.name === name)!;
  }

  public async createTable(table: CreateTableParam): Promise<Table> {
    const tables = await this.listTables();
    const found = tables.find(t => t.name === table.name);
    if (found) {
      return found;
    }

    const response = await this.client.databases.create({
      parent: {
        type: 'page_id',
        page_id: this.env.getValue('NOTION_PARENT_ID'),
      },
      title: [{
        type: 'text',
        text: {
          content: table.name,
          link: null,
        },
      }],
      properties: Object.assign({}, ...table.columns.map(column => ({
        [column.name]: this.factory.getPropertyByColumn(column.type).columnToProperty(column, tables),
      }))),
    });

    const title = response.title[0];
    if (title.type !== 'text') {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    return {
      id: response.id,
      table: table.table,
      name: title.text.content,
      columns: Object.values(response.properties).map(property => this.factory.getProperty(property.type).propertyToColumn(property, table.columns)),
    };
  }

  private buildSearchFilter(params: SearchParams): QueryDatabaseParameters['filter'] {
    const filter = params.filter;
    if (!filter) {
      return undefined;
    }

    const keys = Object.keys(filter);
    if (keys.length === 0) {
      return undefined;
    }

    return {
      and: keys.map(property => {
        const setting = filter[property];
        if ('int' in setting) {
          return { property, number: setting.int };
        }

        if ('datetime' in setting) {
          const { past_week, past_month, past_year, next_week, next_month, next_year, ...rest } = setting.datetime;
          return {
            property,
            date: {
              ...rest,
              ...(past_week ? { past_week: {} } : {}),
              ...(past_month ? { past_month: {} } : {}),
              ...(past_year ? { past_year: {} } : {}),
              ...(next_week ? { next_week: {} } : {}),
              ...(next_month ? { next_month: {} } : {}),
              ...(next_year ? { next_year: {} } : {}),
            },
          };
        }

        return { property, ...setting };
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

  private async lazyLoadForTable(table: Table, ids: string[]): Promise<Record<string, string>> {
    const name = table.columns.find(column => column.type === 'title')!.name;
    const response = await this.client.databases.query({
      database_id: table.id,
      filter: {
        or: ids.map(id => ({
          property: name,
          type: 'title',
          title: {
            equals: id,
          },
        })),
      },
    });

    if (!response.results.length) {
      return {};
    }

    type TitleType = {
      type: 'title';
      title: {
        plain_text: string;
      }[];
    };
    const title = Object.keys(response.results[0].properties).find(name => response.results[0].properties[name].type === 'title')!;
    return Object.fromEntries(response.results.map(result => {
      return [result.id, (result.properties[title] as TitleType).title[0].plain_text];
    }));
  }

  private async lazyLoadForResults(tableInfo: Table, results: QueryDatabaseResponse['results']): Promise<Record<string, Record<string, string>>> {
    type RelationType = {
      id: string;
      name: string;
      type: 'relation';
      relation_id: string;
      multiple: boolean;
    }
    const filterRelation = (column: TableColumn): column is RelationType => column.type === 'relation';

    return Object.assign({}, ...await tableInfo.columns.filter(filterRelation).reduce(async (prev, column) => {
      const acc = await prev;
      const table = await this.getTableByName(column.name);
      const ids = results.flatMap(result => {
        const property = result.properties[column.name];
        if (property && property.type === 'relation') {
          if (column.multiple) {
            return property.relation.map(relation => relation.id);
          } else if (property.relation[0].id) {
            return [property.relation[0].id];
          }
        }

        /* istanbul ignore next */
        return [];
      });
      return acc.concat({ [column.name]: await this.lazyLoadForTable(table, ids) });
    }, Promise.resolve([] as Record<string, Record<string, string>>[])));
  }

  private parseResultProperties<T extends DatabaseRecord>(result: QueryDatabaseResponse['results'][number], columns: TableColumn[], lazyLoading: Record<string, Record<string, string>>): T {
    return {
      ...Object.fromEntries(columns.map(column => {
        if (!(column.name in result.properties)) {
          return [column.name, null];
        }

        const property = result.properties[column.name];
        return [column.name, this.factory.getProperty(property.type).toResultValue(property, column, lazyLoading)];
      })) as T,
      id: result.id,
    };
  }

  public async search(table: string, params: SearchParams): Promise<{ results: T[]; hasMore: boolean; cursor: string | null }> {
    const tableInfo = await this.getTable(table);
    const {
      results,
      has_more,
      next_cursor,
    } = await this.client.databases.query({
      database_id: tableInfo.id,
      ...NotionDatabase.buildSearchPagination(params),
      filter: this.buildSearchFilter(params),
      sorts: NotionDatabase.buildSearchSorts(params),
    });

    const lazyLoading = await this.lazyLoadForResults(tableInfo, results);
    return {
      results: results.map(result => this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading)),
      hasMore: has_more,
      cursor: next_cursor,
    };
  }

  public async find(table: string, id: string): Promise<T | null> {
    const tableInfo = await this.getTable(table);
    try {
      const result = await this.client.pages.retrieve({ page_id: id });
      const lazyLoading = await this.lazyLoadForResults(tableInfo, [result]);

      return this.parseResultProperties<T>(result, tableInfo.columns, lazyLoading);
    } catch (error) {
      return null;
    }
  }

  public async create(table: string, value: T): Promise<T> {
    const tableInfo = await this.getTable(table);
    await this.client.pages.create({
      parent: {
        database_id: tableInfo.id,
      },
      properties: {},
    });

    return Promise.resolve(undefined);
  }

  public update(table: string, value: Partial<T>): Promise<T> {
    return Promise.resolve(undefined);
  }

  public delete(table: string, id: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
