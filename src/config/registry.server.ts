import { container } from 'tsyringe';
import { IndexPageProps } from '@/web/pages/server';

// pages
container.registerSingleton('IIndexPageProps', IndexPageProps);
