import type { TableColumn, CreateTableColumn, DatabaseRecord, CreateData } from '$/server/shared/database';
import type { QueryDatabaseResponseProperty } from '@/server/shared/database/notion';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class RichTextProperty extends Base {
  get columnType(): CreateTableColumn['type'] {
    return 'text';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string]): TableColumn {
    return {
      name: property.name,
      type: 'text',
    };
  }

  public columnToProperty(): CreateDatabaseParameters['properties'][string] {
    return { rich_text: {} };
  }

  public toResultValue(property: QueryDatabaseResponseProperty): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'rich_text') {
      return property.rich_text[0]?.plain_text ?? null;
    }

    /* istanbul ignore next */
    return null;
  }

  public async toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      rich_text: data[column.name] === null ? [] : [
        {
          type: 'text',
          text: { content: String(data[column.name]) },
        },
      ],
    };
  }
}
