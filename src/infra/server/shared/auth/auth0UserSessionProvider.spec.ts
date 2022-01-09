import TestEnv from '^/__mocks__/env';
import Auth0UserSessionProvider from './auth0UserSessionProvider';

describe('Auth0UserSessionProvider', () => {
  it('Authorization からユーザーセッションを取得する', async () => {
    const mockVerify = jest.fn(() => ({
      userId: 'user-id',
      dbType: 'notion',
    }));
    const sessionProvider = new Auth0UserSessionProvider(new TestEnv({
      JWT_SECRET: 'secret',
      DATABASE_TYPE: 'notion',
    }), {
      verify: mockVerify,
    } as never);

    const userSession = await sessionProvider.getUserSession('Bearer token');
    expect(mockVerify).toBeCalledWith('token', 'secret');
    expect(userSession.userId.value).toBe('user-id');
  });

  it('authorization が空の場合にエラー', async () => {
    const mockVerify = jest.fn(() => ({
      userId: 'user-id',
      dbType: 'notion',
    }));
    const sessionProvider = new Auth0UserSessionProvider(new TestEnv({
      JWT_SECRET: 'secret',
      DATABASE_TYPE: 'notion',
    }), {
      verify: mockVerify,
    } as never);

    await expect(sessionProvider.getUserSession()).rejects.toThrow('Unauthorized');
    expect(mockVerify).not.toBeCalled();
  });

  it('DB が異なる場合にエラー', async () => {
    const mockVerify = jest.fn(() => ({
      userId: 'user-id',
      dbType: 'notion',
    }));
    const sessionProvider = new Auth0UserSessionProvider(new TestEnv({
      JWT_SECRET: 'secret',
      DATABASE_TYPE: 'mysql',
    }), {
      verify: mockVerify,
    } as never);

    await expect(sessionProvider.getUserSession('Bearer token')).rejects.toThrow('Unauthorized');
    expect(mockVerify).toBeCalledWith('token', 'secret');
  });
});
