import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import { inject } from 'tsyringe';
import FetchTasksUseCase from '^/usecase/task/fetchTasksUseCase';
import BaseController from './shared/baseController';

export default class FetchTasksController extends BaseController {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(FetchTasksUseCase) private useCase: FetchTasksUseCase,
  ) {
    super();
  }

  protected async execute(request: Request): Promise<Result | void> {
    const userSession = await this.userSessionProvider.getUserSession(request.headers['authorization']);
    return {
      data: await this.useCase.invoke(userSession),
    };
  }
}
