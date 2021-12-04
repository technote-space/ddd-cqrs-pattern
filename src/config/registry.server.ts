import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { container } from 'tsyringe';
import Auth0auth from '@/server/shared/auth/auth0auth';
import NotionDatabase from '@/server/shared/database/notion';
import JsonwebtokenJwt from '@/server/shared/jsonwebtokenJwt';
import Env from '@/server/shared/env';
import NotionTaskQueryService from '@/server/task/notionTaskQueryService';
import NotionTaskRepository from '@/server/task/notionTaskRepository';
import NotionUserRepository from '@/server/user/notionUserRepository';
import { IndexPageProps } from '@/web/pages/index/server';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import userSchema from '../../schema/user.json';

container.registerSingleton('IEnv', Env);
container.registerSingleton('IAuth', Auth0auth);
container.registerSingleton('IJwt', JsonwebtokenJwt);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// schema
container.registerInstance('MigrationSchemas', [userSchema, tagSchema, taskSchema] as MigrationSchemas);

// database
container.registerSingleton('IDatabase', NotionDatabase);
container.registerSingleton('INotionUserRepository', NotionUserRepository);
container.registerSingleton('INotionTaskRepository', NotionTaskRepository);
container.registerSingleton('INotionTaskQueryService', NotionTaskQueryService);
