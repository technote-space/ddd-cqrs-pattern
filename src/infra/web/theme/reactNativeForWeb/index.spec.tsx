import renderer from 'react-test-renderer';
import { ReactNativeForWebTheme } from '@/web/theme/reactNativeForWeb';
import * as hooks from './hooks';

describe('ReactNativeForWebTheme', () => {
  it('should return theme', () => {
    jest.spyOn(hooks, 'useHooks').mockReturnValue({ styles: { root: { display: 'flex' } } as never });
    const theme = new ReactNativeForWebTheme();
    const tree = renderer.create(theme.render({ children: <div>test</div> }));
    expect(tree).toMatchSnapshot();
  });
});
