import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import { container } from 'tsyringe';
import LoginOrRegisterUseCase from '^/usecase/user/loginOrRegisterUseCase';
import BaseController from './shared/baseController';

export type LoginData = { token: string };
export default class LoginOrRegisterController extends BaseController<LoginData> {
  protected async execute(request: Request<LoginData>): Promise<Result | void> {
    await container.resolve(LoginOrRegisterUseCase).invoke(request.body.token);
  }
}
