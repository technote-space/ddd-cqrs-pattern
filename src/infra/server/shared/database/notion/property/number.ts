import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class NumberProperty extends Base<'number'> {
  get columnType(): CreateTableColumn['type'] {
    return 'int';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'int',
    };
  }

  public columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    return { number: { format: 'number' } };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string] {
    if (property.type === 'number') {
      return property.number;
    }

    /* istanbul ignore next */
    return null;
  }

  public toPropertyValue(value: DatabaseRecord[string], column: CreateTableColumn): CreatePageParameters['properties'] {
    return {
      number: Number(value),
    };
  }
}
