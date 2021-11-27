import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { container } from 'tsyringe';
import NotionDatabase from '@/server/shared/database/notion';
import Env from '@/server/shared/env';
import { IndexPageProps } from '@/web/pages/index/server';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import userSchema from '../../schema/user.json';

container.registerInstance('IEnv', Env);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// schema
container.registerInstance('MigrationSchemas', [userSchema, tagSchema, taskSchema] as MigrationSchemas);

// database
container.registerInstance('IDatabase', NotionDatabase);
