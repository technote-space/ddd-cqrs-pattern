import { container } from 'tsyringe';
import { App } from '@/web/app';
import { IndexPage } from '@/web/pages/index';

container.registerSingleton('IApp', App);

// pages
container.registerSingleton('IIndexPage', IndexPage);
