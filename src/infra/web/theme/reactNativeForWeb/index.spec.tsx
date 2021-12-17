import renderer from 'react-test-renderer';
import { container } from 'tsyringe';
import View from '@/web/components/reactNativeForWeb/view';
import * as darkModeHooks from '@/web/theme/drakMode';
import ReactNativeForWebTheme from '@/web/theme/reactNativeForWeb';

describe('ReactNativeForWebTheme', () => {
  it('should return theme', () => {
    jest.spyOn(darkModeHooks, 'useDarkMode').mockImplementation(() => true);
    container.registerInstance('ThemeColor', {
      background: { dark: '#1a202c' },
      text: { dark: '#fff' },
    });
    container.registerInstance('Components/View', View);
    const theme = new ReactNativeForWebTheme();
    const tree = renderer.create(theme.render({ children: <div>test</div> }));
    expect(tree).toMatchSnapshot();
  });
});
