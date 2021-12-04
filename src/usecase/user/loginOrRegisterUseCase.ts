import type IAuth from '$/server/shared/auth';
import type IEnv from '$/server/shared/env';
import type IJwt from '$/server/shared/jwt';
import type IUserRepository from '$/server/user/userRepository';
import type { UserJwtPayload } from '^/usecase/shared/userSession';
import { inject } from 'tsyringe';
import User from '$/server/user/user';
import Token from '$/server/user/valueObject/token';
import Unauthorized from '$/shared/exceptions/http/unauthorized';

export default class LoginOrRegisterUseCase {
  public constructor(
    @inject('IEnv') private env: IEnv,
    @inject('IAuth') private auth: IAuth,
    @inject('IJwt') private jwt: IJwt<UserJwtPayload>,
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {
  }

  public async invoke(token: string): Promise<string> {
    const contents = await this.auth.verify(token);
    if (!contents) {
      throw new Unauthorized();
    }

    const user = await this.findOrCreateUser(Token.create(contents.sub));
    return this.jwt.sign({ userId: user.userId.value }, this.env.getValue('JWT_SECRET'));
  }

  private async findOrCreateUser(token: Token): Promise<User> {
    const user = await this.userRepository.findByToken(token);
    if (!user) {
      const user = User.create(token);
      await this.userRepository.save(user);
      return user;
    }

    return user;
  }
}
