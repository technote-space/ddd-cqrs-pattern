import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class RichTextProperty extends Base<'rich_text'> {
  get columnType(): CreateTableColumn['type'] {
    return 'text';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'text',
    };
  }

  public columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    return { rich_text: {} };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'rich_text') {
      return property.rich_text[0]?.plain_text ?? null;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(data: Omit<DatabaseRecord, 'id'>, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      rich_text: [
        {
          type: 'text',
          text: { content: String(data[column.name]) },
        },
      ],
    };
  }
}
