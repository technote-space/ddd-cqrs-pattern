import type { TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class DateProperty extends Base {
  get columnType(): CreateTableColumn['type'] {
    return 'datetime';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'datetime',
    };
  }

  public columnToProperty(): CreateDatabaseParameters['properties'][string] {
    return { date: {} };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string]): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'date') {
      return property.date?.start ?? null;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(data: Omit<DatabaseRecord, 'id'>, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      date: {
        start: String(data[column.name]),
      },
    };
  }
}
