import type { Table, TableColumn, CreateTableColumn, DatabaseRecord, CreateData } from '$/server/shared/database';
import type NotionDatabase from '..';
import type { QueryDatabaseResponseProperty } from '..';
import type {
  GetDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
} from '@notionhq/client/build/src/api-endpoints';

export default abstract class Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(protected database: NotionDatabase) {
  }

  public abstract get columnType(): CreateTableColumn['type'];

  public abstract propertyToColumn(property: GetDatabaseResponse['properties'][string], columns: CreateTableColumn[]): TableColumn | undefined;

  public abstract columnToProperty(column: CreateTableColumn, tables: Table[]): CreateDatabaseParameters['properties'][string];

  public abstract toResultValue(property: QueryDatabaseResponseProperty, column: TableColumn, lazyLoading: Record<string, Record<string, string>>): DatabaseRecord[string];

  public abstract toPropertyValue(data: CreateData, column: TableColumn): Promise<CreatePageParameters['properties']>;
}
