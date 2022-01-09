import { container } from 'tsyringe';
import Auth0UserSessionProvider from '@/server/shared/auth/auth0UserSessionProvider';
import Auth0Auth from '@/server/shared/auth/auth0auth';
import { PrismaClient } from '@/server/shared/database/mysql';
import JsonwebtokenJwt from '@/server/shared/jsonwebtokenJwt';
import NodeCacheCache from '@/server/shared/nodeCacheCache';
import Slack from '@/server/shared/slack';
import MySqlTaskQueryService from '@/server/task/mySqlTaskQueryService';
import MySqlTaskRepository from '@/server/task/mySqlTaskRepository';
import NotionTaskQueryService from '@/server/task/notionTaskQueryService';
import NotionTaskRepository from '@/server/task/notionTaskRepository';
import MySqlUserRepository from '@/server/user/mySqlUserRepository';
import NotionUserRepository from '@/server/user/notionUserRepository';
import IndexPageProps from '@/web/pages/index/server';

container.registerSingleton('IJwt', JsonwebtokenJwt);
container.registerSingleton('ICache', NodeCacheCache);
container.registerSingleton('ISlack', Slack);
container.registerSingleton('IAuth/server', Auth0Auth);
container.registerSingleton('IUserSessionProvider', Auth0UserSessionProvider);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// database
/* istanbul ignore next */
if (process.env.DATABASE_TYPE === 'mysql') {
  container.registerSingleton('IUserRepository', MySqlUserRepository);
  container.registerSingleton('ITaskRepository', MySqlTaskRepository);
  container.registerSingleton('ITaskQueryService', MySqlTaskQueryService);
  container.registerInstance('PrismaClient', new PrismaClient());
} else {
  container.registerSingleton('IUserRepository', NotionUserRepository);
  container.registerSingleton('ITaskRepository', NotionTaskRepository);
  container.registerSingleton('ITaskQueryService', NotionTaskQueryService);
}
