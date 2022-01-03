import TagId from './tagId';

describe('TagId', () => {
  it('ラベルが「タグID」', () => {
    expect(TagId.getLabel()).toBe('タグID');
  });
});
