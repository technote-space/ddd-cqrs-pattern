import type { IIndexPageProps, Props } from '$/web/pages';
import type { GetStaticPropsResult } from 'next';
import { singleton } from 'tsyringe';

@singleton()
export default class IndexPageProps implements IIndexPageProps {
  public async getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    return {
      props: {},
      revalidate: undefined,
    };
  }
}
