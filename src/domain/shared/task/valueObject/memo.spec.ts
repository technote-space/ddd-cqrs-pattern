import Memo from './memo';

describe('Memo', () => {
  it('ラベルが「メモ」', () => {
    expect(Memo.getLabel()).toBe('メモ');
  });

  it('長さが 1000 より長いとエラー', () => {
    expect(Memo.create('a'.repeat(1000)).getErrors('memo')).toEqual([]);
    expect(Memo.create('a'.repeat(1001)).getErrors('memo')).toEqual([{ name: 'memo', 'error': '1000文字より短く入力してください' }]);
  });
});
