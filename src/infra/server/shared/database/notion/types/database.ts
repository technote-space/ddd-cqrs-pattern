export type Property<T> = {
  id: string;
  name: string;
  type: T;
};
export type TitleProperty = Property<'title'>;
export type NumberProperty = Property<'number'> & {
  format: string;
};
export type RichTextProperty = Property<'rich_text'>;
export type DateProperty = Property<'date'>;
export type RelationProperty = Property<'relation'> & {
  database_id: string;
};

export type DatabaseProperty = TitleProperty | NumberProperty | RichTextProperty | DateProperty | RelationProperty;
export type Database = {
  object: 'database';
  id: string;
  created_time: string;
  last_edited_time: string;
  title: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
  properties: Record<string, DatabaseProperty>;
};

export type CreateDatabaseTitleProperty = { title: {} };
export type CreateDatabaseNumberProperty = { number: { format: string } };
export type CreateDatabaseRichTextProperty = { rich_text: {} };
export type CreateDatabaseDateProperty = { date: {} };
export type CreateDatabaseRelationProperty = { relation: { database_id: string } };
export type CreateDatabaseProperty =
  CreateDatabaseTitleProperty
  | CreateDatabaseNumberProperty
  | CreateDatabaseRichTextProperty
  | CreateDatabaseDateProperty
  | CreateDatabaseRelationProperty;
export type CreateDatabaseBody = {
  parent: {
    type: 'page_id';
    page_id: string;
  };
  title: {
    type: 'text';
    text: {
      content: string;
      link: null;
    };
  }[];
  properties: Record<string, CreateDatabaseProperty>;
};
