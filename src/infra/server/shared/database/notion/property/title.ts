import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import Base from './base';

export default class TitleProperty extends Base<'title'> {
  get columnType(): CreateTableColumn['type'] {
    return 'title';
  }

  public propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn {
    return {
      id: property.id,
      name: property.name,
      type: 'title',
    };
  }

  public columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string] {
    return { title: {} };
  }

  public toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string] {
    if (property.type === 'title' && property.title[0]?.type === 'text') {
      return property.title[0].text.content;
    }

    /* istanbul ignore next */
    throw new Error('サポートされていません');
  }

  public async toPropertyValue(value: DatabaseRecord[string], column: TableColumn): Promise<CreatePageParameters['properties']> {
    return {
      title: [
        {
          type: 'text',
          text: { content: String(value) },
        },
      ],
    };
  }
}
