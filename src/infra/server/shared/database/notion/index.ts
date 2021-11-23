import type IDatabase from '$/server/shared/database';
import type { Table, CreateTableParam, TableColumn, CreateTableColumn } from '$/server/shared/database';
import type { ApiInstance } from './api/$api';
import type IEnv from '$/server/shared/env';
import { singleton, inject, container } from 'tsyringe';
import { filterDatabaseBlock } from './types/block';
import type { DatabaseProperty, CreateDatabaseProperty } from './types/database';

@singleton()
export default class NotionDatabase<T> implements IDatabase<T> {
  public constructor(
    @inject('NotionClient') private client: ApiInstance,
    @inject('IEnv') private env: IEnv,
  ) {
  }

  private static propertyToColumn(property: DatabaseProperty): TableColumn {
    return property.type === 'relation' ? {
      id: property.id,
      name: property.name,
      type: property.type,
      database_id: property.database_id,
    } : {
      id: property.id,
      name: property.name,
      type: property.type,
    };
  }

  private static columnToProperty(column: CreateTableColumn): CreateDatabaseProperty {
    if (column.type === 'relation') {
      return { relation: { database_id: column.database_id } };
    }

    if (column.type === 'number') {
      return { number: { format: 'number' } };
    }

    return {
      [column.type]: {},
    } as CreateDatabaseProperty;
  }

  public async listTables(): Promise<Table[]> {
    const response = await this.client.blocks._blockId(this.env.getValue('NOTION_PARENT_ID')).children.$get();
    return response.results.filter(filterDatabaseBlock).reduce(async (prev, result) => {
      const acc = await prev;
      const database = await this.client.databases._databaseId(result.id).$get();

      return acc.concat({
        id: result.id,
        name: result.child_database.title,
        columns: Object.values(database.properties).map(NotionDatabase.propertyToColumn),
      });
    }, Promise.resolve([] as Table[]));
  }

  public async createTable(table: CreateTableParam): Promise<Table> {
    const tables = await this.listTables();
    const found = tables.find(t => t.name === table.name);
    if (found) {
      return found;
    }

    const response = await this.client.databases.$post({
      body: {
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
          [column.name]: NotionDatabase.columnToProperty(column),
        }))),
      },
    });

    return {
      id: response.id,
      name: response.title[0].text.content,
      columns: Object.values(response.properties).map(NotionDatabase.propertyToColumn),
    };
  }

  public pagination(table: string, key: string, value: string, pageSize: number, cursor?: string): Promise<T[]> {
    return Promise.resolve([]);
  }

  public find(table: string, pk: string, id: string): Promise<T | null> {
    return Promise.resolve(null);
  }

  public create(table: string, value: T): Promise<T> {
    return Promise.resolve(undefined);
  }

  public update(table: string, value: Partial<T>): Promise<T> {
    return Promise.resolve(undefined);
  }

  public delete(table: string, pk: string, id: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
