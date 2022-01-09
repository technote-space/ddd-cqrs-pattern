import User from '$/shared/user/user';
import Token from '$/shared/user/valueObject/token';
import UserId from '$/shared/user/valueObject/userId';
import MySqlUserRepository from './mySqlUserRepository';

describe('MySqlUserRepository', () => {
  describe('findById', () => {
    it('指定されたIDのユーザーを取得', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve({
        id: '1',
        token: 'token',
      }));
      const repository = new MySqlUserRepository({ user: { findFirst: mockFindFirst } } as never);

      const user = await repository.findById(UserId.create('1'));
      expect(mockFindFirst).toBeCalledTimes(1);
      expect(user.userId.value).toBe('1');
      expect(user.token.value).toBe('token');
    });

    it('指定されたIDのユーザーが存在しない場合エラー', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve(null));
      const repository = new MySqlUserRepository({ user: { findFirst: mockFindFirst } } as never);

      await expect(repository.findById(UserId.create('1'))).rejects.toThrow('ユーザーが見つかりません');
      expect(mockFindFirst).toBeCalledTimes(1);
    });
  });

  describe('findByToken', () => {
    it('指定されたユーザー識別子のユーザーを取得', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve({
        id: '1',
        token: 'token',
      }));
      const repository = new MySqlUserRepository({ user: { findFirst: mockFindFirst } } as never);

      const user = await repository.findByToken(Token.create('token'));
      expect(mockFindFirst).toBeCalledTimes(1);
      expect(user).not.toBeNull();
      expect(user!.userId.value).toBe('1'); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      expect(user!.token.value).toBe('token'); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    });

    it('指定されたIDのユーザーが存在しない場合エラー', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve(null));
      const repository = new MySqlUserRepository({ user: { findFirst: mockFindFirst } } as never);

      expect(await repository.findByToken(Token.create('test'))).toBeNull();
      expect(mockFindFirst).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('ユーザーIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({ id: '1', token: 'token' }));
      const repository = new MySqlUserRepository({ user: { create: mockCreate } } as never);

      const saved = await repository.save(User.create(Token.create('token')));
      expect(mockCreate).toBeCalledWith({ data: { token: 'token' } });
      expect(saved.userId.value).toBe('1');
    });

    it('ユーザーIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve({ id: '1', token: 'token' }));
      const repository = new MySqlUserRepository({ user: { update: mockUpdate } } as never);

      const saved = await repository.save(User.reconstruct(UserId.create('1'), Token.create('token')));
      expect(mockUpdate).toBeCalledWith({ data: { token: 'token' }, where: { id: 1 } });
      expect(saved.userId.value).toBe('1');
    });
  });
});
