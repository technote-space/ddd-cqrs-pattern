import type { IApp } from '$/web/app';
import type { ITheme } from '$/web/theme';
import type { AppProps } from 'next/app';
import { singleton, inject } from 'tsyringe';

@singleton()
export class App implements IApp {
  public constructor(
    @inject('ITheme') private theme: ITheme,
  ) {
  }

  public create(): (props: Pick<AppProps, 'Component' | 'pageProps'>) => JSX.Element {
    // eslint-disable-next-line react/display-name
    return ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => {
      return this.theme.render({}, <Component {...pageProps} />);
    };
  }
}
