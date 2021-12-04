import type IJwt from '$/server/shared/jwt';
import TestEnv from '^/__mocks__/env';
import Auth0UserSessionProvider from './auth0UserSessionProvider';

describe('Auth0UserSessionProvider', () => {
  it('Authorization からユーザーセッションを取得する', async () => {
    const mockVerify = jest.fn(() => ({
      userId: 'user-id',
    }));
    const sessionProvider = new Auth0UserSessionProvider(new TestEnv({ JWT_SECRET: 'secret' }), {
      verify: mockVerify,
    } as never as IJwt<any>); // eslint-disable-line @typescript-eslint/no-explicit-any

    const userSession = await sessionProvider.getUserSession('Bearer token');
    expect(mockVerify).toBeCalledWith('token', 'secret');
    expect(userSession.userId.value).toBe('user-id');
  });
});
