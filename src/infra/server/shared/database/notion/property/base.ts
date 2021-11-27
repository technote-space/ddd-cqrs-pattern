import type { Table, TableColumn, CreateTableColumn, DatabaseRecord } from '$/server/shared/database';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import NotionDatabase from '..';

export default abstract class Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(protected database: NotionDatabase<any>) {
  }

  public abstract get columnType(): CreateTableColumn['type'];

  public abstract propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn | undefined;

  public abstract columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string];

  public abstract toResultValue(property: QueryDatabaseResponse['results'][number]['properties'][string], column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string];

  public abstract toPropertyValue(data: Omit<DatabaseRecord, 'id'>, column: TableColumn): Promise<CreatePageParameters['properties']>;
}
