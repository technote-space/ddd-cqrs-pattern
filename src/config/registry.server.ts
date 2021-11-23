import type { MigrationSchemas } from '^/usecase/migrationUseCase';
import { container } from 'tsyringe';
import { IndexPageProps } from '@/web/pages/index/server';
import api from '@/server/shared/database/notion/api/$api';
import aspida from '@aspida/axios';
import userSchema from '../../schema/user.json';
import tagSchema from '../../schema/tag.json';
import taskSchema from '../../schema/task.json';
import Env from '@/server/shared/env';

container.registerInstance('NotionClient', api(aspida()));
container.registerInstance('IEnv', Env);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// schema
container.registerInstance('MigrationSchemas', {
  'USER_DB_ID': userSchema,
  'TAG_DB_ID': tagSchema,
  'TASK_DB_ID': taskSchema,
} as MigrationSchemas);
