import type { IApp } from '$/web/app';
import type { IContextProvider } from '$/web/shared/contextProvider';
import type { ITheme } from '$/web/theme';
import type { AppProps } from 'next/app';
import type { ReactNode } from 'react';
import { singleton, inject, container } from 'tsyringe';

@singleton()
export default class App implements IApp {
  public constructor(
    @inject('ITheme') private theme: ITheme,
    @inject('providers') private providers: string[],
  ) {
  }

  private applyProviders(component: ReactNode, index: number): ReactNode {
    if (index >= this.providers.length) {
      return component;
    }

    const Provider = container.resolve<IContextProvider>(this.providers[index]).getProvider();
    return this.applyProviders(<Provider>
      {component}
    </Provider>, index + 1);
  }

  public create(): (props: Pick<AppProps, 'Component' | 'pageProps'>) => JSX.Element {
    // eslint-disable-next-line react/display-name
    return ({ Component, pageProps }: Pick<AppProps, 'Component' | 'pageProps'>) => this.theme.render({
      children: this.applyProviders(<Component {...pageProps} />, 0),
    });
  }
}
