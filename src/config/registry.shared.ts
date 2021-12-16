import type { ThemeColor } from '$/web/theme/color';
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
import { DarkModeContext } from '@/web/theme/drakMode/redux';
import ReactNativeForWebTheme from '@/web/theme/reactNativeForWeb';
import api from '^/pages/api/$api';

container.registerSingleton('IDocument', ExpoDocument);
container.registerSingleton('ITheme', ReactNativeForWebTheme);
container.registerSingleton('IApp', App);
container.registerSingleton('IAuthContext', AuthContext);
container.registerSingleton('IAuth/front', Auth0Auth);
container.registerSingleton('IApi', Api);
container.registerSingleton('Auth0ContextProvider', Auth0ContextProvider);
container.registerSingleton('ILayoutComponent', LayoutComponent);
container.registerSingleton('ILoadingContext', LoadingContext);
container.registerSingleton('ILoadingComponent', LoadingComponent);
container.registerSingleton('IDarkModeContext', DarkModeContext);
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
container.registerInstance('ThemeColor', {
  background: {
    light: '#fffaf0',
    dark: '#1a202c',
  },
  text: {
    light: '#1a202c',
    dark: '#fff',
  },
  subText: {
    light: '#e2e8f0',
    dark: '#e2e8f0',
  },
  primary: {
    light: '#6200ee',
    dark: '#5200ae',
  },
  accent: {
    light: '#03dac6',
    dark: '#019856',
  },
  primaryText: {
    light: '#fff',
    dark: '#fff',
  },
  accentText: {
    light: '#000',
    dark: '#fff',
  },
} as ThemeColor);

// pages
container.registerSingleton('IIndexPage', IndexPage);
