import { container } from 'tsyringe';
import Auth0UserSessionProvider from '@/server/shared/auth/auth0UserSessionProvider';
import Auth0auth from '@/server/shared/auth/auth0auth';
import JsonwebtokenJwt from '@/server/shared/jsonwebtokenJwt';
import NotionTaskQueryService from '@/server/task/notionTaskQueryService';
import NotionTaskRepository from '@/server/task/notionTaskRepository';
import NotionUserRepository from '@/server/user/notionUserRepository';
import { IndexPageProps } from '@/web/pages/index/server';

container.registerSingleton('IJwt', JsonwebtokenJwt);
container.registerSingleton('IAuth', Auth0auth);
container.registerSingleton('IUserSessionProvider', Auth0UserSessionProvider);

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);

// database
container.registerSingleton('IUserRepository', NotionUserRepository);
container.registerSingleton('ITaskRepository', NotionTaskRepository);
container.registerSingleton('ITaskQueryService', NotionTaskQueryService);
