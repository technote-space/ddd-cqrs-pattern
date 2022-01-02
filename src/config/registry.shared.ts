import aspida from '@aspida/axios';
import { container } from 'tsyringe';
import App from '@/web/app';
import ExpoDocument from '@/web/document/expo';
import IndexPage from '@/web/pages/index';
import Api from '@/web/shared/api';
import { Auth0Auth, Auth0ContextProvider, AuthContext } from '@/web/shared/auth/auth0auth';
import LayoutComponent from '@/web/shared/layout';
import { LoadingComponent, LoadingContext } from '@/web/shared/loading/redux';
import { ReduxContextProvider } from '@/web/shared/store/reduxStore';
import { NativeBaseToast } from '@/web/shared/toast/nativeBaseToast';
import { NativeBaseThemeProvider } from '@/web/theme/nativeBase';
import { ColorModeContext } from '@/web/theme/nativeBase/colorModeManager';
import api from '^/pages/api/$api';

container.registerSingleton('IDocument', ExpoDocument);
container.registerSingleton('IApp', App);
container.registerSingleton('IAuthContext', AuthContext);
container.registerSingleton('IAuth/front', Auth0Auth);
container.registerSingleton('IApi', Api);
container.registerSingleton('Auth0ContextProvider', Auth0ContextProvider);
container.registerSingleton('ILayoutComponent', LayoutComponent);
container.registerSingleton('ILoadingContext', LoadingContext);
container.registerSingleton('ILoadingComponent', LoadingComponent);
container.registerSingleton('IToast', NativeBaseToast);
container.registerSingleton('ReduxContextProvider', ReduxContextProvider);
container.registerSingleton('NativeBaseThemeProvider', NativeBaseThemeProvider);
container.registerSingleton('IColorModeManagerContext', ColorModeContext);
container.registerInstance('contexts', [
  'IAuthContext',
  'ILoadingContext',
  'IColorModeManagerContext',
]);
container.registerInstance('providers', [
  'Auth0ContextProvider',
  'NativeBaseThemeProvider',
  'ReduxContextProvider',
]);
container.registerInstance('auth0Config', {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
});
container.registerInstance('client', api(aspida()));

// pages
container.registerSingleton('IIndexPage', IndexPage);
