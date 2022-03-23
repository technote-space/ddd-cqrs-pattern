export type CreateTableColumn = {
  name: string;
} & ({
  type: 'pk' | 'datetime';
} | {
  type: 'title' | 'text' | 'int';
  length?: number;
} | {
  type: 'relation';
  relation: string;
  multiple?: boolean;
  aggregates?: boolean;
});
export type TableColumn = {
  name: string;
} & ({
  type: 'pk' | 'datetime';
} | {
  type: 'title' | 'text' | 'int';
  length?: number;
} | {
  type: 'relation';
  relation_id: string;
  multiple: boolean;
  aggregates: boolean;
});
export type Table = {
  id: string;
  table: string;
  columns: TableColumn[];
};
export type CreateTableParam = {
  table: string;
  columns: CreateTableColumn[];
};
type TextSearchConditions = {
  equals?: string;
  does_not_equal?: string;
  contains?: string;
  does_not_contain?: string;
  starts_with?: string;
  ends_with?: string;
  is_empty?: boolean;
  is_not_empty?: boolean;
};
type TextSearch = {
  title: TextSearchConditions;
} | {
  rich_text: TextSearchConditions;
} | {
  url: TextSearchConditions;
} | {
  email: TextSearchConditions;
} | {
  phone_number: TextSearchConditions;
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
export type Relation = {
  id: string;
  value: string;
};
export type DatabaseRecord = Record<string, Primitive | Relation | Relation[] | null> & { id: string };
export type CreateData = Record<string, Primitive | Primitive[] | null>;
export type UpdateData = CreateData & { id: string };

export default interface IDatabase {
  listTables(): Promise<Table[]>;

  getTable(value: string, key: keyof Table): Promise<Table>;

  createTable(table: string): Promise<Table>;

  search<T extends DatabaseRecord>(table: string, params: SearchParams): Promise<{ results: T[]; hasMore: boolean; cursor: string | null }>;

  find<T extends DatabaseRecord>(table: string, id: string): Promise<T | null>;

  create<T extends DatabaseRecord>(table: string, data: CreateData): Promise<T>;

  update<T extends DatabaseRecord>(table: string, data: UpdateData): Promise<T>;

  delete(table: string, id: string): Promise<boolean>;
}
