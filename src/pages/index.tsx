import type { IIndexPage, IIndexPageProps, Props } from '$/web/pages';
import type { GetStaticProps } from 'next';
import { container } from 'tsyringe';

export default (container.resolve('IIndexPage') as IIndexPage).create();

export const getStaticProps: GetStaticProps<Props> = async () => (container.resolve('IIndexPageProps') as IIndexPageProps).getStaticProps();
