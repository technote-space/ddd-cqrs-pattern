import type { Database } from '@/server/shared/database/notion/types/database';

export type Methods = {
  get: {
    resBody: Database;
  }
}
