import type { Result } from './shared/baseController';
import { inject } from 'tsyringe';
import LoginOrRegisterUseCase from '^/usecase/user/loginOrRegisterUseCase';
import BaseController from './shared/baseController';

export type LoginData = { token: string };
export type ResultData = { authorization: string };
export default class LoginOrRegisterController extends BaseController<ResultData, LoginData> {
  public constructor(
    @inject(LoginOrRegisterUseCase) private useCase: LoginOrRegisterUseCase,
  ) {
    super();
  }

  protected async execute(): Promise<Result<ResultData> | void> {
    return {
      data: {
        authorization: await this.useCase.invoke(this.getBody().token),
      },
    };
  }
}
