import renderer from 'react-test-renderer';
import { NoTheme } from '@/web/theme/noTheme';

describe('NoTheme', () => {
  it('should return theme', () => {
    const theme = new NoTheme();
    const tree = renderer.create(theme.render({ children: <div>test</div> }));
    expect(tree).toMatchSnapshot();
  });
});
