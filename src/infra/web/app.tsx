import type { IAppService } from '$/web/app';
import type { ITheme } from '$/web/theme';
import type { AppProps } from 'next/app';
import { singleton, inject } from 'tsyringe';

@singleton()
export class AppService implements IAppService {
  public constructor(
    @inject('ITheme') private theme: ITheme,
  ) {
  }

  public create(): (props: AppProps) => JSX.Element {
    // eslint-disable-next-line react/display-name
    return ({ Component, pageProps }: AppProps) => {
      return this.theme.render(<Component {...pageProps} />);
    };
  }
}
