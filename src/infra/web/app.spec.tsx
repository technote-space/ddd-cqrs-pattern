import type { ITheme } from '$/web/theme';
import type { PropsWithChildren } from 'react';
import renderer from 'react-test-renderer';
import { App } from './app';

class TestTheme implements ITheme {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public render({ children }: PropsWithChildren<any>) {
    return <div className="theme">
      {children}
    </div>;
  }
}

describe('App', () => {
  it('App を生成', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockGetStoreProvider = jest.fn(() => ({ children }: any) => children);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockGetAuthProvider = jest.fn(() => ({ children }: any) => children);
    const app = new App(
      new TestTheme(),
      { getStoreProvider: mockGetStoreProvider } as never,
      { getAuthProvider: mockGetAuthProvider } as never,
    );

    const tree = renderer.create(app.create()({
      Component: () => <div>test</div>,
      pageProps: {},
    }));
    expect(tree).toMatchSnapshot();
    expect(mockGetStoreProvider).toBeCalledTimes(1);
    expect(mockGetAuthProvider).toBeCalledTimes(1);
  });
});
