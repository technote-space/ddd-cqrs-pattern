import UserId from './userId';

describe('UserId', () => {
  it('名前が「ユーザーID」', () => {
    expect(UserId.create('test').getName()).toBe('ユーザーID');
  });
});
