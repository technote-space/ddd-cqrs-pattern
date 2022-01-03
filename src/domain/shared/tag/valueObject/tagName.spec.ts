import TagName from './tagName';

describe('TagName', () => {
  it('ラベルが「タグ名」', () => {
    expect(TagName.getLabel()).toBe('タグ名');
  });

  it('長さが 16 より長いとエラー', () => {
    expect(TagName.create('a'.repeat(16)).validate('tagName')).toEqual([]);
    expect(TagName.create('a'.repeat(17)).validate('tagName')).toEqual([{ name: 'tagName', error: '16文字より短く入力してください' }]);
  });
});
