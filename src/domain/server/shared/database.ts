export type CreateTableColumn = {
  name: string;
} & ({
  type: 'title' | 'text' | 'datetime' | 'int';
} | {
  type: 'relation';
  relation: string;
  multiple?: boolean;
});
export type TableColumn = {
  id: string;
  name: string;
} & ({
  type: 'pk' | 'title' | 'text' | 'datetime' | 'int';
} | {
  type: 'relation';
  relation_id: string;
  multiple: boolean;
});
export type Table = {
  id: string;
  table: string;
  name: string;
  columns: TableColumn[];
};
export type CreateTableParam = {
  table: string;
  name: string;
  columns: CreateTableColumn[];
};
type TextSearch = {
  text: {
    equals?: string;
    does_not_equal?: string;
    contains?: string;
    does_not_contain?: string;
    starts_with?: string;
    ends_with?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  }
};
type IntSearch = {
  int: {
    equals?: number;
    does_not_equal?: number;
    greater_than?: number;
    less_than?: number;
    greater_than_or_equal_to?: number;
    less_than_or_equal_to?: number;
    is_empty?: boolean;
    is_not_empty?: boolean;
  }
};
type DatetimeSearch = {
  datetime: {
    equals?: string;
    before?: string;
    after?: string;
    on_or_before?: string;
    on_or_after?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
    past_week?: boolean;
    past_month?: boolean;
    past_year?: boolean;
    next_week?: boolean;
    next_month?: boolean;
    next_year?: boolean;
  }
};
type RelationSearch = {
  relation: {
    contains?: string;
    does_not_contain?: string;
    is_empty?: boolean;
    is_not_empty?: boolean;
  };
};
export type SearchParams = {
  type?: 'and' | 'or',
  filter?: { property: string, condition: TextSearch | IntSearch | DatetimeSearch | RelationSearch }[];
  sort?: {
    column: string;
    direction: 'ascending' | 'descending';
  };
  pageSize?: number;
  cursor?: string;
};
export type Primitive = number | string | boolean;
export type DatabaseRecord = Record<string, Primitive | Primitive[] | null> & { id: string };

export default interface IDatabase<T extends DatabaseRecord> {
  listTables(): Promise<Table[]>;

  getTable(value: string, key: keyof Table): Promise<Table>;

  createTable(table: CreateTableParam): Promise<Table>;

  search(table: string, params: SearchParams): Promise<{ results: T[]; hasMore: boolean; cursor: string | null }>;

  find(table: string, id: string): Promise<T | null>;

  create(table: string, value: Omit<T, 'id'>): Promise<T>;

  update(table: string, value: Partial<T>): Promise<T>;

  delete(table: string, id: string): Promise<void>;
}