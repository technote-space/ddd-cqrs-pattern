import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

describe('tsyringe', () => {
  it('should resolve', () => {
    // theme
    expect(() => container.resolve('ITheme')).not.toThrow();
    expect(() => container.resolve('IDarkMode')).not.toThrow();

    // shared
    expect(() => container.resolve('IApp')).not.toThrow();
    expect(() => container.resolve('IIndexPage')).not.toThrow();

    // server
    expect(() => container.resolve('IIndexPageProps')).not.toThrow();
  });
});
