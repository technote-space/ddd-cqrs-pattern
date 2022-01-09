import type { MigrationSchemas } from '^/usecase/migration/databaseMigrationUseCase';
import dotenv from 'dotenv';
import { container } from 'tsyringe';
import NotionDatabase from '@/server/shared/database/notion';
import Env from '@/server/shared/env';
import DatabaseMigrationUseCase from '^/usecase/migration/databaseMigrationUseCase';
import MySqlMigrationUseCase from '^/usecase/migration/mySqlMigrationUseCase';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import userSchema from '../../schema/user.json';

dotenv.config();

if (process.env.DATABASE_TYPE === 'mysql') {
  // usecase
  container.registerSingleton('IMigrationUseCase', MySqlMigrationUseCase);
} else {
  container.registerSingleton('IEnv', Env);

  // schema
  container.registerInstance('MigrationSchemas', [userSchema, tagSchema, taskSchema] as MigrationSchemas);

  // database
  container.registerSingleton('IDatabase', NotionDatabase);

  // usecase
  container.registerSingleton('IMigrationUseCase', DatabaseMigrationUseCase);
}
