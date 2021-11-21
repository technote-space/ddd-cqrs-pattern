import TagName from './tagName';

describe('TagName', () => {
  it('名前が「タグ名」', () => {
    expect(TagName.create('test').getName()).toBe('タグ名');
  });

  it('長さが 16 より長いとエラー', () => {
    expect(TagName.create('a'.repeat(16)).validate()).toEqual([]);
    expect(TagName.create('a'.repeat(17)).validate()).toEqual(['16文字より短く入力してください']);
  });
});
