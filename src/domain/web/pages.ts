import type { GetStaticPropsResult } from 'next';
import type { VFC } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Props = {};

export interface IIndexPage {
  create(): VFC<Props>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ScreenProps = {};
export interface IScreen {
  create(): VFC<ScreenProps>;
}

export interface IIndexPageProps {
  getStaticProps(postType?: string): Promise<GetStaticPropsResult<Props>>;
}
