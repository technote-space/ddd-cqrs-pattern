import type { IContextProvider } from '$/web/shared/contextProvider';
import type { PropsWithChildren, VFC } from 'react';
import renderer from 'react-test-renderer';
import { container } from 'tsyringe';
import App from './app';

class Provider1 implements IContextProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProvider(): VFC<PropsWithChildren<any>> {
    // eslint-disable-next-line react/display-name
    return ({ children }) => <div className="provider1">{children}</div>;
  }
}

class Provider2 implements IContextProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProvider(): VFC<PropsWithChildren<any>> {
    // eslint-disable-next-line react/display-name
    return ({ children }) => <div className="provider2">{children}</div>;
  }
}

describe('App', () => {
  it('App を生成', () => {
    container.registerSingleton('Provider1', Provider1);
    container.registerSingleton('Provider2', Provider2);
    const app = new App(
      ['Provider1', 'Provider2'],
    );

    const tree = renderer.create(app.create()({
      Component: () => <div>test</div>,
      pageProps: {},
    }));
    expect(tree).toMatchSnapshot();
  });
});
