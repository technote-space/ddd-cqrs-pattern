import type { IApp } from '$/web/app';
import type { IStore } from '$/web/shared/store';
import type { ITheme } from '$/web/theme';
import type { AppProps } from 'next/app';
import { singleton, inject } from 'tsyringe';

@singleton()
export class App implements IApp {
  public constructor(
    @inject('ITheme') private theme: ITheme,
    @inject('IStore') private store: IStore,
  ) {
  }

  public create(): (props: Pick<AppProps, 'Component' | 'pageProps'>) => JSX.Element {
    const Provider = this.store.getStoreProvider();

    // eslint-disable-next-line react/display-name
    return ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => this.theme.render({
      children: <Provider>
        <Component {...pageProps} />
      </Provider>,
    });
  }
}
