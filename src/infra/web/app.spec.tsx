import renderer from 'react-test-renderer';
import { NoTheme } from '@/web/theme/noTheme';
import { App } from './app';

describe('App', () => {
  it('should return App', () => {
    const app = (new App(new NoTheme())).create();
    const tree = renderer.create(app({ Component: () => <div/>, pageProps: {} }));
    expect(tree).toMatchSnapshot();
  });
});
