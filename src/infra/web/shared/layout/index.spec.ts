import renderer from 'react-test-renderer';
import LayoutComponent from '.';

describe('LayoutComponent', () => {
  it('Layoutのコンテキストプロバイダー', () => {
    const mockRender = jest.fn(() => 'LoadingComponent');
    const component = new LayoutComponent({ render: mockRender } as never);

    const tree = renderer.create(component.render({ children: 'Children' }));
    expect(tree).toMatchSnapshot();
    expect(mockRender).toBeCalledTimes(1);
  });
});
