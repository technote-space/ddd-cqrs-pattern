import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import { inject } from 'tsyringe';
import LoginOrRegisterUseCase from '^/usecase/user/loginOrRegisterUseCase';
import BaseController from './shared/baseController';

export type LoginData = { token: string };
export default class LoginOrRegisterController extends BaseController<LoginData> {
  public constructor(
    @inject(LoginOrRegisterUseCase) private useCase: LoginOrRegisterUseCase,
  ) {
    super();
  }

  protected async execute(request: Request<LoginData>): Promise<Result | void> {
    return {
      data: {
        authorization: await this.useCase.invoke(request.body.token),
      },
    };
  }
}
