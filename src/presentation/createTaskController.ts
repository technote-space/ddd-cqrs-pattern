import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { CreateData } from '^/usecase/task/createTaskUseCase';
import { inject, container } from 'tsyringe';
import CreateTaskUseCase from '^/usecase/task/createTaskUseCase';
import BaseController from './shared/baseController';

export default class CreateTaskController extends BaseController<CreateData> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
  ) {
    super();
  }

  protected async execute(request: Request<CreateData>): Promise<Result | void> {
    const userSession = await this.userSessionProvider.getUserSession(request.headers['authorization']);
    return {
      status: 201,
      data: await container.resolve(CreateTaskUseCase).invoke(userSession, request.body),
    };
  }
}
