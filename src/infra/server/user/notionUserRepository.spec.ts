import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import UserId from '$/server/user/valueObject/userId';
import NotionUserRepository from './notionUserRepository';

describe('NotionUserRepository', () => {
  describe('findById', () => {
    it('指定されたIDのユーザーを取得', async () => {
      const mockFind = jest.fn(() => Promise.resolve({
        id: 'test',
        token: 'token',
      }));
      const repository = new NotionUserRepository({ find: mockFind } as never);

      const user = await repository.findById(UserId.create('test'));
      expect(mockFind).toBeCalledTimes(1);
      expect(user.userId.value).toBe('test');
      expect(user.token.value).toBe('token');
    });

    it('指定されたIDのユーザーが存在しない場合エラー', async () => {
      const mockFind = jest.fn(() => Promise.resolve(null));
      const repository = new NotionUserRepository({ find: mockFind } as never);

      await expect(repository.findById(UserId.create('test'))).rejects.toThrow('ユーザーが見つかりません');
      expect(mockFind).toBeCalledTimes(1);
    });
  });

  describe('findByToken', () => {
    it('指定されたユーザー識別子のユーザーを取得', async () => {
      const mockSearch = jest.fn(() => Promise.resolve({
        results: [{
          id: 'test',
          token: 'token',
        }],
        hasMore: false,
        cursor: null,
      }));
      const repository = new NotionUserRepository({ search: mockSearch } as never);

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
      const repository = new NotionUserRepository({ search: mockSearch } as never);

      expect(await repository.findByToken(Token.create('test'))).toBeNull();
      expect(mockSearch).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('ユーザーIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({ id: '1234567890' }));
      const repository = new NotionUserRepository({ create: mockCreate } as never);

      const user = User.create(Token.create('token'));
      await repository.save(user);
      expect(mockCreate).toBeCalledWith('users', { token: 'token' });
      expect(user.userId.value).toBe('1234567890');
    });

    it('ユーザーIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve(null));
      const repository = new NotionUserRepository({ update: mockUpdate } as never);

      await repository.save(User.reconstruct(UserId.create('id'), Token.create('token')));
      expect(mockUpdate).toBeCalledWith('users', { id: 'id', token: 'token' });
    });
  });
});
