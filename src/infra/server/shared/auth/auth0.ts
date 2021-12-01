import type IAuth from '$/server/shared/auth';
import type { AuthContents } from '$/server/shared/auth';
import type IEnv from '$/server/shared/env';
import fetch from 'node-fetch';
import { singleton, inject } from 'tsyringe';

@singleton()
export default class Auth0 implements IAuth {
  public constructor(
    @inject('IEnv') private env: IEnv,
  ) {
  }

  public async verify(token: string): Promise<null | AuthContents> {
    const response = await fetch(`https://${this.env.getValue('AUTH0_DOMAIN')}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const contents = await response.json() as { sub: string };
    return {
      sub: contents.sub,
    };
  }
}
