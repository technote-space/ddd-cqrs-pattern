import { container } from 'tsyringe';
import { App } from '@/web/app';
import { IndexPage } from '@/web/pages/index';
import { Auth0Auth, AuthContext } from '@/web/shared/auth/auth0';
import { LayoutComponent } from '@/web/shared/layout';
import { Loading, LoadingComponent, LoadingContext } from '@/web/shared/loading';
import { ReduxStore } from '@/web/shared/store/redux';
import { DarkMode, DarkModeContext } from '@/web/theme/darkMode';

container.registerSingleton('IApp', App);
container.registerSingleton('IAuthContext', AuthContext);
container.registerSingleton('IAuth', Auth0Auth);
container.registerSingleton('ILayoutComponent', LayoutComponent);
container.registerSingleton('ILoadingContext', LoadingContext);
container.registerSingleton('ILoading', Loading);
container.registerSingleton('ILoadingComponent', LoadingComponent);
container.registerSingleton('IDarkModeContext', DarkModeContext);
container.registerSingleton('IDarkMode', DarkMode);
container.registerSingleton('IStore', ReduxStore);
container.registerInstance('contexts', [
  'IAuthContext',
  'ILoadingContext',
  'IDarkModeContext',
]);

// pages
container.registerSingleton('IIndexPage', IndexPage);
