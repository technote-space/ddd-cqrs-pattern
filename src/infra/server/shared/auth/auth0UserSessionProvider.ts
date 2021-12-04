import type IEnv from '$/server/shared/env';
import type IJwt from '$/server/shared/jwt';
import type IUserSessionProvider from '^/presentation/shared/userSessionProvider';
import type { UserSession } from '^/usecase/shared/userSession';
import type { UserJwtPayload } from '^/usecase/shared/userSession';
import { inject, singleton } from 'tsyringe';
import UserId from '$/server/user/valueObject/userId';

@singleton()
export default class Auth0UserSessionProvider implements IUserSessionProvider {
  public constructor(
    @inject('IEnv') private env: IEnv,
    @inject('IJwt') private jwt: IJwt<UserJwtPayload>,
  ) {
  }

  public async getUserSession(authorization: string): Promise<UserSession> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    const decoded = this.jwt.verify(token, this.env.getValue('JWT_SECRET'));
    return {
      userId: UserId.create(decoded.userId),
    };
  }
}
