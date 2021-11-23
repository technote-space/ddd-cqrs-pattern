export type BlockType =
  'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'child_page'
  | 'child_database'
  | 'embed'
  | 'image'
  | 'video'
  | 'file'
  | 'pdf'
  | 'bookmark'
  | 'callout'
  | 'quote'
  | 'equation'
  | 'divider'
  | 'table_of_contents'
  | 'column'
  | 'column_list'
  | 'link_preview'
  | 'synced_block'
  | 'template'
  | 'link_to_page'
  | 'unsupported';

export type Block<T extends BlockType> = {
  object: string;
  id: string;
  type: T;
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  has_children: boolean;
};
export type DatabaseBlock = Block<'child_database'> & {
  child_database: {
    title: string;
  }
};

export const filterDatabaseBlock = (block: Block<BlockType>): block is DatabaseBlock => block.type === 'child_database';
