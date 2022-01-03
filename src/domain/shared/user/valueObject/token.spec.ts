import Token from './token';

describe('Token', () => {
  it('ラベルが「ユーザー識別子」', () => {
    expect(Token.getLabel()).toBe('ユーザー識別子');
  });
});
