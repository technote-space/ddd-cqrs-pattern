import type { Block, DatabaseBlock, BlockType } from '@/server/shared/database/notion/types/block';
import type { Pagination } from '@/server/shared/database/notion/types/shared';

export type Methods = {
  get: {
    resBody: {
      object: 'list';
      results: (Block<BlockType> | DatabaseBlock)[];
    } & Pagination;
  }
}
