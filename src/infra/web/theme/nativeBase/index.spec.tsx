import renderer from 'react-test-renderer';
import { container } from 'tsyringe';
import { NativeBaseThemeProvider } from '@/web/theme/nativeBase';

describe('NativeBaseTheme', () => {
  it('should return theme', () => {
    container.registerInstance('ThemeColor', {
      background: { dark: '#1a202c' },
      text: { dark: '#fff' },
    });
    const theme = new NativeBaseThemeProvider();
    const Provider = theme.getProvider();
    const tree = renderer.create(<Provider>
      <div>test</div>
    </Provider>);
    expect(tree).toMatchSnapshot();
  });
});
