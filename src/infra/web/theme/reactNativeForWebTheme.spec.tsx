import renderer from 'react-test-renderer';
import { ReactNativeForWebTheme } from '@/web/theme/reactNativeForWebTheme';

describe('NoTheme', () => {
  it('should return theme', () => {
    const theme = new ReactNativeForWebTheme();
    const tree = renderer.create(theme.render({ children: <div>test</div> }));
    expect(tree).toMatchSnapshot();
  });
});
