import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { container } from 'tsyringe';
import Auth0 from '@/server/shared/auth/auth0';
import NotionDatabase from '@/server/shared/database/notion';
import Env from '@/server/shared/env';
import { IndexPageProps } from '@/web/pages/index/server';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import userSchema from '../../schema/user.json';

container.registerSingleton('IEnv', Env);
container.registerSingleton('IAuth', Auth0);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// schema
container.registerInstance('MigrationSchemas', [userSchema, tagSchema, taskSchema] as MigrationSchemas);

// database
container.registerSingleton('IDatabase', NotionDatabase);
