import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

type PropertyType = {
  type: 'relation';
  relation: {
    database_id: string;
    synced_property_id: string;
    synced_property_name: string;
  };
  id: string;
  name: string;
}
type ColumnType = {
  name: string;
  type: 'relation';
  relation: string;
  multiple?: boolean;
}

export default class RelationProperty extends Base<'relation'> {
  get columnType(): CreateTableColumn['type'] {
    return 'relation';
  }

  public propertyToColumn(property: PropertyType, columns: CreateTableColumn[]): TableColumn | undefined {
    const column = columns.find(column => column.name === property.name);
    if (!column || !('relation' in column)) {
      return undefined;
    }

    return {
      id: property.id,
      name: property.name,
      type: 'relation',
      relation_id: property.relation.database_id,
      multiple: !!column.multiple,
    };
  }

  public columnToProperty(column: ColumnType, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    const table = tables.find(table => table.table === column.relation);
    if (!table) {
      throw new Error('リレーション先が見つかりません');
    }

    return { relation: { database_id: table.id } };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string] {
    if (property.type === 'relation' && column.type === 'relation' && column.name in lazyLoading) {
      if (column.multiple) {
        return property.relation.map(relation => lazyLoading[column.name][relation.id] ?? null).filter(item => item !== null);
      } else if (property.relation[0].id && property.relation[0].id in lazyLoading[column.name]) {
        return lazyLoading[column.name][property.relation[0].id];
      }
    }

    /* istanbul ignore next */
    return null;
  }

  private async getRelationIds(table: Table, values: string[], data: Omit<DatabaseRecord, 'id'>): Promise<string[]> {
    const column = table.columns.find(column => column.type === 'title')!;
    const searched = await this.database.search(table.table, {
      type: 'or',
      filter: values.map(value => ({
        property: column.name,
        condition: {
          text: {
            equals: value,
          },
        },
      })),
    });
    const searchedNames = searched.results.map(result => result[column.name]);
    const searchedIds = searched.results.map(result => result.id);
    const notFound = values.filter(value => !searchedNames.includes(value));
    const createdIds = await notFound.reduce(async (prev, title) => {
      const acc = await prev;
      const result = await this.database.create(table.table, {
        ...data,
        [column.name]: title,
      });
      return acc.concat(result.id);
    }, Promise.resolve([] as string[]));

    return searchedIds.concat(createdIds);
  }

  public async toPropertyValue(data: Omit<DatabaseRecord, 'id'>, column: TableColumn): Promise<CreatePageParameters['properties']> {
    if (column.type !== 'relation') {
      /* istanbul ignore next */
      throw new Error('サポートされていません');
    }

    const table = await this.database.getTable(column.relation_id, 'id');
    const ids = await this.getRelationIds(table, column.multiple ? data[column.name] as string[] : [data[column.name] as string], data);
    return {
      relation: ids.map(id => ({ id })),
    };
  }
}
