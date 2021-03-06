import { createRequest } from '^/__mocks__/request';
import LoginOrRegisterController from './loginOrRegisterController';

describe('LoginOrRegisterController', () => {
  it('認証トークンが返る', async () => {
    const mockInvoke = jest.fn(() => Promise.resolve('token'));
    const controller = new LoginOrRegisterController(
      {} as never,
      { invoke: mockInvoke } as never,
    );

    const result = await controller.invoke(createRequest({
      body: { token: 'Bearer token' },
    }));

    expect(mockInvoke).toBeCalledWith('Bearer token');
    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.data.authorization).toEqual('token');
    }
  });
});
