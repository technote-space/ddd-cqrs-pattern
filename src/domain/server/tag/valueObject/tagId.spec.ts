import TagId from './tagId';

describe('TagId', () => {
  it('名前が「タグID」', () => {
    expect(TagId.create('test').getName()).toBe('タグID');
  });
});
