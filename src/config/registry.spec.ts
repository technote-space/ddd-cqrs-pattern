import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

describe('tsyringe', () => {
  const cached = process.env;

  beforeEach(() => {
    process.env = { ...cached };
  });

  afterAll(() => {
    process.env = cached;
  });

  it('should resolve', () => {
    process.env['NOTION_SECRET'] = 'secret';
    process.env['NOTION_BASE_URL'] = 'https://example.com';

    // theme
    expect(() => container.resolve('ITheme')).not.toThrow();

    // sharedMethod
    expect(() => container.resolve('useProcess')).not.toThrow();
    expect(() => container.resolve('useAddProcess')).not.toThrow();
    expect(() => container.resolve('useDeleteProcess')).not.toThrow();
    expect(() => container.resolve('useLoading')).not.toThrow();
    expect(() => container.resolve('useIsProcessRunning')).not.toThrow();
    expect(() => container.resolve('useDarkMode')).not.toThrow();
    expect(() => container.resolve('useToggleDarkMode')).not.toThrow();

    // shared
    expect(() => container.resolve('IApp')).not.toThrow();
    expect(() => container.resolve('IAuthContext')).not.toThrow();
    expect(() => container.resolve('IAuth/front')).not.toThrow();
    expect(() => container.resolve('IApi')).not.toThrow();
    expect(() => container.resolve('ILayoutComponent')).not.toThrow();
    expect(() => container.resolve('ILoadingContext')).not.toThrow();
    expect(() => container.resolve('ILoadingComponent')).not.toThrow();
    expect(() => container.resolve('IDarkModeContext')).not.toThrow();
    expect(() => container.resolve('Auth0ContextProvider')).not.toThrow();
    expect(() => container.resolve('ReduxContextProvider')).not.toThrow();
    expect(() => container.resolve('contexts')).not.toThrow();
    expect(() => container.resolve('providers')).not.toThrow();
    expect(() => container.resolve('auth0Config')).not.toThrow();
    expect(() => container.resolve('ThemeColor')).not.toThrow();
    expect(() => container.resolve('client')).not.toThrow();
    expect(() => container.resolve('IIndexPage')).not.toThrow();

    // migration
    expect(() => container.resolve('IEnv')).not.toThrow();
    expect(() => container.resolve('MigrationSchemas')).not.toThrow();
    expect(() => container.resolve('IDatabase')).not.toThrow();

    // server
    expect(() => container.resolve('IJwt')).not.toThrow();
    expect(() => container.resolve('ICache')).not.toThrow();
    expect(() => container.resolve('ISlack')).not.toThrow();
    expect(() => container.resolve('IAuth/server')).not.toThrow();
    expect(() => container.resolve('IUserSessionProvider')).not.toThrow();
    expect(() => container.resolve('IIndexPageProps')).not.toThrow();
    expect(() => container.resolve('IUserRepository')).not.toThrow();
    expect(() => container.resolve('ITaskRepository')).not.toThrow();
    expect(() => container.resolve('ITaskQueryService')).not.toThrow();
  });
});
