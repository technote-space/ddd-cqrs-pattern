import type { CreateDatabaseBody, Database } from '@/server/shared/database/notion/types/database';

export type Methods = {
  post: {
    reqBody: CreateDatabaseBody;
    resBody: Database;
  }
}
