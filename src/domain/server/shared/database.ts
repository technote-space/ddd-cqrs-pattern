export type CreateTableColumn = {
  name: string;
} & ({
  type: 'title' | 'number' | 'rich_text' | 'date';
} | {
  type: 'relation';
  database_id: string;
});
export type TableColumn = { id: string } & CreateTableColumn;
export type Table = {
  id: string;
  name: string;
  columns: TableColumn[];
};
export type CreateTableParam = {
  name: string;
  columns: CreateTableColumn[];
};

export default interface IDatabase<T> {
  listTables(): Promise<Table[]>;

  createTable(table: CreateTableParam): Promise<Table>;

  pagination(table: string, key: string, value: string, pageSize: number, cursor?: string): Promise<T[]>;

  find(table: string, pk: string, id: string): Promise<T | null>;

  create(table: string, value: T): Promise<T>;

  update(table: string, value: Partial<T>): Promise<T>;

  delete(table: string, pk: string, id: string): Promise<void>;
}
