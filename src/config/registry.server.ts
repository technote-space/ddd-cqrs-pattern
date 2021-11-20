import { container } from 'tsyringe';
import { IndexPageProps } from '@/web/pages/index/server';

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);
