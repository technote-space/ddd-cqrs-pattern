import type { IPage, ServerProps } from '$/web/shared/page';
import type { GetStaticPropsResult } from 'next';

export type Props = ServerProps;

export type IIndexPage = IPage<Props>;

export interface IIndexPageProps {
  getStaticProps(): Promise<GetStaticPropsResult<Props>>;
}
