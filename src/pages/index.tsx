import type { IIndexPage, IIndexPageProps, Props } from '$/web/pages';
import type { GetStaticProps } from 'next';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

export default container.resolve<IIndexPage>('IIndexPage').create();

export const getStaticProps: GetStaticProps<Props> = async () => container.resolve<IIndexPageProps>('IIndexPageProps').getStaticProps();
