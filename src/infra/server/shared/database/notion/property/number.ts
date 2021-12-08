import type { TableColumn, CreateTableColumn, DatabaseRecord, CreateData } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class NumberProperty extends Base {
  get columnType(): CreateTableColumn['type'] {
    return 'int';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'int',
    };
  }

  public columnToProperty(): CreateDatabaseParameters['properties'][string] {
    return { number: { format: 'number' } };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string]): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'number') {
      return property.number;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      number: data[column.name] === null ? null : Number(data[column.name]),
    };
  }
}
