import renderer from 'react-test-renderer';
import { container } from 'tsyringe';
import { NativeBaseThemeProvider } from '@/web/theme/nativeBase';
import LayoutComponent from '.';

jest.mock('react-redux');

describe('LayoutComponent', () => {
  it('Layoutのコンテキストプロバイダー', () => {
    container.registerInstance('ThemeColor', {
      background: { dark: '#1a202c' },
      text: { dark: '#fff' },
    });
    const mockRender = jest.fn(() => 'LoadingComponent');
    const mockUseLogout = jest.fn();
    const component = new LayoutComponent({ render: mockRender } as never, { useLogout: mockUseLogout } as never);
    const theme = new NativeBaseThemeProvider();
    const Provider = theme.getProvider();

    const tree = renderer.create(<Provider>
      {component.render({ children: 'Children' })}
    </Provider>);
    expect(tree).toMatchSnapshot();
    expect(mockRender).toBeCalledTimes(1);
    expect(mockUseLogout).toBeCalledTimes(1);
  });
});
