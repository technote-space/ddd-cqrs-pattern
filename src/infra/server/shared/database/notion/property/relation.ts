import type { Table, TableColumn, CreateTableColumn, Relation, CreateData } from '$/server/shared/database';
import type {
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import InvalidUsage from '$/shared/exceptions/domain/invalidUsage';
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
  aggregates?: boolean;
}

export default class RelationProperty extends Base {
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
      aggregates: !!column.aggregates,
    };
  }

  public columnToProperty(column: ColumnType, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    const table = tables.find(table => table.table === column.relation);
    /* istanbul ignore next */
    if (!table) {
      /* istanbul ignore next */
      throw new InvalidUsage(`リレーション先が見つかりません: ${column.relation}`);
    }

    return { relation: { database_id: table.id } };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): Relation | Relation[] | null {
    /* istanbul ignore next */
    if (property.type === 'relation' && column.type === 'relation' && column.name in lazyLoading) {
      if (column.multiple) {
        const filterRelation = (item: null | Relation): item is Relation => item !== null;
        return property.relation.map(relation => {
          const value = lazyLoading[column.name][relation.id] ?? null;
          if (value) {
            return { id: relation.id, value } as Relation;
          }

          return null;
        }).filter(filterRelation);
      } else if (property.relation[0].id && property.relation[0].id in lazyLoading[column.name]) {
        const value = lazyLoading[column.name][property.relation[0].id];
        if (value) {
          return { id: property.relation[0].id, value };
        }
      }
    }

    /* istanbul ignore next */
    return null;
  }

  private async getRelationIds(table: Table, values: string[], data: CreateData): Promise<string[]> {
    const column = table.columns.find(column => column.type === 'title');
    /* istanbul ignore next */
    if (!column) {
      /* istanbul ignore next */
      throw new InvalidUsage(`サポートされていません: ${table.name}`);
    }

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

  public async toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']> {
    /* istanbul ignore next */
    if (column.type !== 'relation') {
      /* istanbul ignore next */
      throw new InvalidUsage(`サポートされていません: ${column.type}`);
    }

    const table = await this.database.getTable(column.relation_id, 'id');
    const values = column.multiple ? data[column.name] as string[] : [data[column.name] as string];
    const ids = column.aggregates ? await this.getRelationIds(table, values, data) : values;
    return {
      relation: ids.map(id => ({ id })),
    };
  }
}
