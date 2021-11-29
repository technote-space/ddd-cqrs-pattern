import Token from './token';

describe('Token', () => {
  it('名前が「ユーザー識別子」', () => {
    expect(Token.create('test').getName()).toBe('ユーザー識別子');
  });
});
