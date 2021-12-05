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
    expect(() => container.resolve('IDarkMode')).not.toThrow();

    // shared
    expect(() => container.resolve('IApp')).not.toThrow();
    expect(() => container.resolve('IIndexPage')).not.toThrow();

    // migration
    expect(() => container.resolve('IEnv')).not.toThrow();
    expect(() => container.resolve('MigrationSchemas')).not.toThrow();
    expect(() => container.resolve('IDatabase')).not.toThrow();

    // server
    expect(() => container.resolve('IJwt')).not.toThrow();
    expect(() => container.resolve('IAuth')).not.toThrow();
    expect(() => container.resolve('IUserSessionProvider')).not.toThrow();
    expect(() => container.resolve('IIndexPageProps')).not.toThrow();
    expect(() => container.resolve('IUserRepository')).not.toThrow();
    expect(() => container.resolve('ITaskRepository')).not.toThrow();
    expect(() => container.resolve('ITaskQueryService')).not.toThrow();
  });
});
