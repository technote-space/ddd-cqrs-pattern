import { container } from 'tsyringe';
import { AppService } from '@/web/app';
import { IndexPage } from '@/web/pages';

container.registerSingleton('IAppService', AppService);

// pages
container.registerSingleton('IIndexPage', IndexPage);
