import aspida from '@aspida/axios';
import { container } from 'tsyringe';
import { App } from '@/web/app';
import { IndexPage } from '@/web/pages/index';
import { Api } from '@/web/shared/api';
import { Auth0Auth, Auth0ContextProvider, AuthContext } from '@/web/shared/auth/auth0auth';
import { LayoutComponent } from '@/web/shared/layout';
import { Loading, LoadingComponent, LoadingContext } from '@/web/shared/loading';
import { ReduxContextProvider } from '@/web/shared/store/reduxStore';
import { DarkMode, DarkModeContext } from '@/web/theme/darkMode';
import api from '^/pages/api/$api';

container.registerSingleton('IApp', App);
container.registerSingleton('IAuthContext', AuthContext);
container.registerSingleton('IAuth/front', Auth0Auth);
container.registerSingleton('IApi', Api);
container.registerSingleton('Auth0ContextProvider', Auth0ContextProvider);
container.registerSingleton('ILayoutComponent', LayoutComponent);
container.registerSingleton('ILoadingContext', LoadingContext);
container.registerSingleton('ILoading', Loading);
container.registerSingleton('ILoadingComponent', LoadingComponent);
container.registerSingleton('IDarkModeContext', DarkModeContext);
container.registerSingleton('IDarkMode', DarkMode);
container.registerSingleton('ReduxContextProvider', ReduxContextProvider);
container.registerInstance('contexts', [
  'IAuthContext',
  'ILoadingContext',
  'IDarkModeContext',
]);
container.registerInstance('providers', [
  'Auth0ContextProvider',
  'ReduxContextProvider',
]);
container.registerInstance('auth0Config', {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
});
container.registerInstance('client', api(aspida()));

// pages
container.registerSingleton('IIndexPage', IndexPage);
