import renderer from 'react-test-renderer';
import { IndexPage } from '.';

describe('IndexPage', () => {
  it('should return IndexPage component', () => {
    const Component = (new IndexPage()).create();
    expect(Component.displayName).toBe('IndexPage');

    const tree = renderer.create(<Component/>);
    expect(tree).toMatchSnapshot();
  });
});
