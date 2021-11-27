import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class DateProperty extends Base<'date'> {
  get columnType(): CreateTableColumn['type'] {
    return 'datetime';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'datetime',
    };
  }

  public columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    return { date: {} };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string] {
    if (property.type === 'date') {
      return property.date?.start ?? null;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(value: DatabaseRecord[string], column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      date: {
        start: String(value),
      },
    };
  }
}
