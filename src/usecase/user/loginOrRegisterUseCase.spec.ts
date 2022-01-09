import User from '$/shared/user/user';
import Token from '$/shared/user/valueObject/token';
import UserId from '$/shared/user/valueObject/userId';
import TestEnv from '^/__mocks__/env';
import LoginOrRegisterUseCase from './loginOrRegisterUseCase';

describe('LoginOrRegisterUseCase', () => {
  it('認証が成功した場合(ユーザー未登録)に新しくユーザーが登録されて有効なJWTトークンが返される', async () => {
    const mockVerify = jest.fn(() => Promise.resolve({ sub: 'test-sub' }));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(null));
    const mockUserSave = jest.fn((user: User) => {
      return Promise.resolve(User.reconstruct(UserId.create('generated-id'), user.token));
    });
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret', DATABASE_TYPE: 'notion' }),
      { verify: mockVerify },
      { sign: mockSign } as never, // eslint-disable-line @typescript-eslint/no-explicit-any
      { findByToken: mockUserFindByToken, save: mockUserSave } as never,
    );

    const token = await useCase.invoke('token');
    expect(token.length).not.toBe(0);
    expect(JSON.parse(token)).toEqual({ userId: 'generated-id', dbType: 'notion' });
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).toBeCalledWith({ userId: 'generated-id', dbType: 'notion' }, 'secret');
    expect(mockUserFindByToken).toBeCalledWith(Token.create('test-sub'));
    expect(mockUserSave).toBeCalledWith(User.create(Token.create('test-sub')));
  });

  it('認証が成功した場合(ユーザー登録済み)に新しくユーザーが登録されて有効なJWTトークンが返される', async () => {
    const mockVerify = jest.fn(() => Promise.resolve({ sub: 'test-sub' }));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(User.reconstruct(UserId.create('test-id'), Token.create('test-token'))));
    const mockUserSave = jest.fn(() => Promise.resolve());
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret', DATABASE_TYPE: 'notion' }),
      { verify: mockVerify },
      { sign: mockSign } as never, // eslint-disable-line @typescript-eslint/no-explicit-any
      { findByToken: mockUserFindByToken, save: mockUserSave } as never,
    );

    const token = await useCase.invoke('token');
    expect(token.length).not.toBe(0);
    expect(JSON.parse(token)).toEqual({ userId: 'test-id', dbType: 'notion' });
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).toBeCalledWith({ userId: 'test-id', dbType: 'notion' }, 'secret');
    expect(mockUserFindByToken).toBeCalledWith(Token.create('test-sub'));
    expect(mockUserSave).not.toBeCalled();
  });

  it('認証に失敗した場合はエラー', async () => {
    const mockVerify = jest.fn(() => Promise.resolve(null));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(null));
    const mockUserSave = jest.fn(() => Promise.resolve());
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret', DATABASE_TYPE: 'notion' }),
      { verify: mockVerify },
      { sign: mockSign } as never, // eslint-disable-line @typescript-eslint/no-explicit-any
      { findByToken: mockUserFindByToken, save: mockUserSave } as never,
    );

    await expect(useCase.invoke('token')).rejects.toThrow('Unauthorized');
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).not.toBeCalled();
    expect(mockUserFindByToken).not.toBeCalled();
    expect(mockUserSave).not.toBeCalled();
  });
});
