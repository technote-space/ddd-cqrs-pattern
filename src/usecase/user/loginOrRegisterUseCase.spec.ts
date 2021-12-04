import type IJwt from '$/server/shared/jwt';
import type IUserRepository from '$/server/user/userRepository';
import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import UserId from '$/server/user/valueObject/userId';
import TestEnv from '^/__mocks__/env';
import LoginOrRegisterUseCase from './loginOrRegisterUseCase';

describe('LoginOrRegisterUseCase', () => {
  it('認証が成功した場合(ユーザー未登録)に新しくユーザーが登録されて有効なJWTトークンが返される', async () => {
    const mockVerify = jest.fn(() => Promise.resolve({ sub: 'test-sub' }));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(null));
    const mockUserSave = jest.fn((user: User) => {
      user.userId.setGeneratedId('generated-id');
      return Promise.resolve();
    });
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret' }),
      { verify: mockVerify },
      { sign: mockSign } as never as IJwt<any>,
      { findByToken: mockUserFindByToken, save: mockUserSave } as never as IUserRepository,
    );

    const token = await useCase.invoke('token');
    expect(token.length).not.toBe(0);
    expect(JSON.parse(token)).toEqual({ userId: 'generated-id' });
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).toBeCalledWith({ userId: 'generated-id' }, 'secret');
    expect(mockUserFindByToken).toBeCalledWith(Token.create('test-sub'));
    const userId = UserId.create('generated-id');
    userId.value;
    expect(mockUserSave).toBeCalledWith(User.reconstruct(userId, Token.create('test-sub')));
  });

  it('認証が成功した場合(ユーザー登録済み)に新しくユーザーが登録されて有効なJWTトークンが返される', async () => {
    const mockVerify = jest.fn(() => Promise.resolve({ sub: 'test-sub' }));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(User.reconstruct(UserId.create('test-id'), Token.create('test-token'))));
    const mockUserSave = jest.fn(() => Promise.resolve());
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret' }),
      { verify: mockVerify },
      { sign: mockSign } as never as IJwt<any>,
      { findByToken: mockUserFindByToken, save: mockUserSave } as never as IUserRepository,
    );

    const token = await useCase.invoke('token');
    expect(token.length).not.toBe(0);
    expect(JSON.parse(token)).toEqual({ userId: 'test-id' });
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).toBeCalledWith({ userId: 'test-id' }, 'secret');
    expect(mockUserFindByToken).toBeCalledWith(Token.create('test-sub'));
    expect(mockUserSave).not.toBeCalled();
  });

  it('認証に失敗した場合はエラー', async () => {
    const mockVerify = jest.fn(() => Promise.resolve(null));
    const mockSign = jest.fn((payload) => JSON.stringify(payload));
    const mockUserFindByToken = jest.fn(() => Promise.resolve(null));
    const mockUserSave = jest.fn(() => Promise.resolve());
    const useCase = new LoginOrRegisterUseCase(
      new TestEnv({ JWT_SECRET: 'secret' }),
      { verify: mockVerify },
      { sign: mockSign } as never as IJwt<any>,
      { findByToken: mockUserFindByToken, save: mockUserSave } as never as IUserRepository,
    );

    await expect(useCase.invoke('token')).rejects.toThrow('Unauthorized');
    expect(mockVerify).toBeCalledWith('token');
    expect(mockSign).not.toBeCalled();
    expect(mockUserFindByToken).not.toBeCalled();
    expect(mockUserSave).not.toBeCalled();
  });
});
