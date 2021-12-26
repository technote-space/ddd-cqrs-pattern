import type IAuth from '$/server/shared/auth';
import type { AuthContents } from '$/server/shared/auth';
import type IEnv from '$/server/shared/env';
import axios from 'axios';
import { singleton, inject } from 'tsyringe';

@singleton()
export default class Auth0Auth implements IAuth {
  public constructor(
    @inject('IEnv') private env: IEnv,
  ) {
  }

  public async verify(token: string): Promise<null | AuthContents> {
    try {
      const response = await axios.get(`https://${this.env.getValue('NEXT_PUBLIC_AUTH0_DOMAIN')}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contents = await response.data as { sub: string };
      return {
        sub: contents.sub,
      };
    } catch (e) {
      return null;
    }
  }
}
