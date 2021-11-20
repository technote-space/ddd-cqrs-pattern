import { IndexPage } from '.';

describe('IndexPage', () => {
  it('should return IndexPage component', () => {
    const component = (new IndexPage()).create();
    expect(component.displayName).toBe('IndexPage');
  });
});
