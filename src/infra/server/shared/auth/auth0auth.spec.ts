import TestEnv from '^/__mocks__/env';
import { useMockServer, createHandler } from '^/__mocks__/server';
import Auth0auth from './auth0auth';

describe('Auth0', () => {
  describe('verify', () => {
    useMockServer([
      createHandler('get', 'https://example.com/success/userinfo', 200, {
        'sub': '248289761001',
        'name': 'Jane Josephine Doe',
        'given_name': 'Jane',
        'family_name': 'Doe',
        'middle_name': 'Josephine',
        'nickname': 'JJ',
        'preferred_username': 'j.doe',
        'profile': 'http://exampleco.com/janedoe',
        'picture': 'http://exampleco.com/janedoe/me.jpg',
        'website': 'http://exampleco.com',
        'email': 'janedoe@exampleco.com',
        'email_verified': true,
        'gender': 'female',
        'birthdate': '1972-03-31',
        'zoneinfo': 'America/Los_Angeles',
        'locale': 'en-US',
        'phone_number': '+1 (111) 222-3434',
        'phone_number_verified': false,
        'address': {
          'country': 'us',
        },
        'updated_at': '1556845729',
      }),
      createHandler('get', 'https://example.com/fail/userinfo', 401, {}),
    ]);

    it('検証に成功した場合に情報が返る', async () => {
      const auth = new Auth0auth(new TestEnv({
        AUTH0_DOMAIN: 'example.com/success',
      }));
      const contents = await auth.verify('token');

      expect(contents).toEqual({
        sub: '248289761001',
      });
    });

    it('検証に失敗した場合にnullが返る', async () => {
      const auth = new Auth0auth(new TestEnv({
        AUTH0_DOMAIN: 'example.com/fail',
      }));
      const contents = await auth.verify('token');

      expect(contents).toBeNull();
    });
  });
});
