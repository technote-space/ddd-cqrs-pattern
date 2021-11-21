import Memo from './memo';

describe('Memo', () => {
  it('名前が「メモ」', () => {
    expect(Memo.create('test').getName()).toBe('メモ');
  });

  it('長さが 1000 より長いとエラー', () => {
    expect(Memo.create('a'.repeat(1000)).validate()).toEqual([]);
    expect(Memo.create('a'.repeat(1001)).validate()).toEqual(['1000文字より短く入力してください']);
  });
});
