import type { TableColumn, CreateTableColumn, DatabaseRecord, CreateData } from '$/server/shared/database';
import type { QueryDatabaseResponseProperty } from '@/server/shared/database/notion';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
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

  public toResultValue(property: QueryDatabaseResponseProperty): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'date') {
      return property.date?.start ?? null;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      date: data[column.name] === null ? null : {
        start: String(data[column.name]),
      },
    };
  }
}
