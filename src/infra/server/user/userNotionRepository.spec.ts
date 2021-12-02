import type IDatabase from '$/server/shared/database';
import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import UserId from '$/server/user/valueObject/userId';
import UserNotionRepository from './userNotionRepository';

describe('UserNotionRepository', () => {
  describe('findById', () => {
    it('指定されたIDのユーザーを取得', async () => {
      const mockFind = jest.fn(() => Promise.resolve({
        id: 'test',
        ユーザー識別子: 'token',
      }));
      const repository = new UserNotionRepository({ find: mockFind } as never as IDatabase);

      const user = await repository.findById(UserId.create('test'));
      expect(mockFind).toBeCalledTimes(1);
      expect(user.userId.value).toBe('test');
      expect(user.token.value).toBe('token');
    });

    it('指定されたIDのユーザーが存在しない場合エラー', async () => {
      const mockFind = jest.fn(() => Promise.resolve(null));
      const repository = new UserNotionRepository({ find: mockFind } as never as IDatabase);

      await expect(repository.findById(UserId.create('test'))).rejects.toThrow('ユーザーが見つかりません');
      expect(mockFind).toBeCalledTimes(1);
    });
  });

  describe('findByToken', () => {
    it('指定されたユーザー識別子のユーザーを取得', async () => {
      const mockSearch = jest.fn(() => Promise.resolve({
        results: [{
          id: 'test',
          ユーザー識別子: 'token',
        }],
        hasMore: false,
        cursor: null,
      }));
      const repository = new UserNotionRepository({ search: mockSearch } as never as IDatabase);

      const user = await repository.findByToken(Token.create('token'));
      expect(mockSearch).toBeCalledTimes(1);
      expect(user).not.toBeNull();
      expect(user!.userId.value).toBe('test'); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      expect(user!.token.value).toBe('token'); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    });

    it('指定されたIDのユーザーが存在しない場合エラー', async () => {
      const mockSearch = jest.fn(() => Promise.resolve({
        results: [],
        hasMore: false,
        cursor: null,
      }));
      const repository = new UserNotionRepository({ search: mockSearch } as never as IDatabase);

      expect(await repository.findByToken(Token.create('test'))).toBeNull();
      expect(mockSearch).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('ユーザーIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({ id: '1234567890' }));
      const repository = new UserNotionRepository({ create: mockCreate } as never as IDatabase);

      const user = User.create(Token.create('token'));
      await repository.save(user);
      expect(mockCreate).toBeCalledWith('users', { ユーザー識別子: 'token' });
      expect(user.userId.value).toBe('1234567890');
    });

    it('ユーザーIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve(null));
      const repository = new UserNotionRepository({ update: mockUpdate } as never as IDatabase);

      await repository.save(User.reconstruct(UserId.create('id'), Token.create('token')));
      expect(mockUpdate).toBeCalledWith('users', { id: 'id', ユーザー識別子: 'token' });
    });
  });
});
