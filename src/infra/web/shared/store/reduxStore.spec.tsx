import type { Dispatch, IContext, Reducer } from '$/web/shared/store';
import type { FC, VFC } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { container } from 'tsyringe';
import { ReduxStore } from '@/web/shared/store/reduxStore';

class TextContext implements IContext<{ test: string }> {
  public getKey(): string {
    return 'abc';
  }

  public getInitialState(): { test: string } {
    return { test: 'Click me!!' };
  }

  public getReducerMapObject(): Record<string, Reducer<{ test: string }>> {
    return {
      ['TEST']: (store, action) => ({
        ...store,
        test: action.test,
      }),
    };
  }

  public persistTargets(): Array<keyof { test: string }> {
    return ['test'];
  }

  public update(dispatch: Dispatch, test: string) {
    dispatch({ type: 'TEST', test });
  }

  public getTest(): string {
    return useSelector((state: { abc: { test: string } }) => state.abc.test);
  }
}

const TestComponent: VFC<{ context: TextContext }> = ({ context }) => {
  const dispatch = useDispatch();
  const test = context.getTest();
  const handleClick = useCallback(() => {
    context.update(dispatch, 'Clicked!!');
  }, [context, dispatch]);

  return <button role="button" onClick={handleClick}>{test}</button>;
};

describe('ReduxStore', () => {
  it('reduxStore の動作が正しいことを確認', async () => {
    container.registerSingleton('TextContext', TextContext);
    const store = new ReduxStore(['TextContext']);
    const Provider = store.getStoreProvider();
    const Wrapper: FC = ({ children }) => {
      return <Provider store={store}>{children}</Provider>;
    };
    const context = container.resolve<TextContext>('TextContext');
    render(<TestComponent context={context}/>, { wrapper: Wrapper });
    expect(await screen.findByRole('button')).toHaveTextContent('Click me!!');

    fireEvent.click(await screen.findByRole('button'));

    expect(await screen.findByRole('button')).toHaveTextContent('Clicked!!');
  });
});
