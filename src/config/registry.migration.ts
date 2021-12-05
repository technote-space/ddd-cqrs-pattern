import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { container } from 'tsyringe';
import NotionDatabase from '@/server/shared/database/notion';
import Env from '@/server/shared/env';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import userSchema from '../../schema/user.json';

container.registerSingleton('IEnv', Env);

// schema
container.registerInstance('MigrationSchemas', [userSchema, tagSchema, taskSchema] as MigrationSchemas);

// database
container.registerSingleton('IDatabase', NotionDatabase);
