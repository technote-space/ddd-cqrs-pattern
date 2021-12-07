import type { ILoadingComponent } from '$/web/shared/loading';
import renderer from 'react-test-renderer';
import { LayoutComponent } from '.';

describe('LayoutComponent', () => {
  it('Layoutのコンテキストプロバイダー', () => {
    const mockRender = jest.fn(() => 'LoadingComponent');
    const component = new LayoutComponent({ render: mockRender } as never as ILoadingComponent);

    const tree = renderer.create(component.render({ children: 'Children' }));
    expect(tree).toMatchSnapshot();
  });
});
