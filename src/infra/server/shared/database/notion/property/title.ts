import type { TableColumn, CreateTableColumn, DatabaseRecord, CreateData } from '$/server/shared/database';
import type { QueryDatabaseResponseProperty } from '@/server/shared/database/notion';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';
import InvalidUsage from '$/shared/exceptions/domain/invalidUsage';
import Base from './base';

export default class TitleProperty extends Base {
  get columnType(): CreateTableColumn['type'] {
    return 'title';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'title',
    };
  }

  public columnToProperty(): CreateDatabaseParameters['properties'][string] {
    return { title: {} };
  }

  public toResultValue(property: QueryDatabaseResponseProperty): DatabaseRecord[string] {
    /* istanbul ignore next */
    if (property.type === 'title' && property.title[0]?.type === 'text') {
      return property.title[0].text.content;
    }

    /* istanbul ignore next */
    throw new InvalidUsage(`サポートされていません: ${property.type}`);
  }

  public async toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      title: data[column.name] === null ? [] : [
        {
          type: 'text',
          text: { content: String(data[column.name]) },
        },
      ],
    };
  }
}
