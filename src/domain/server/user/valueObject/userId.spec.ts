import UserId from './userId';

describe('UserId', () => {
  it('ラベルが「ユーザーID」', () => {
    expect(UserId.getLabel()).toBe('ユーザーID');
  });
});
