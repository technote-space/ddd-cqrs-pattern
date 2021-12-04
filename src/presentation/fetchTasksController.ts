import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject } from 'tsyringe';
import FetchTasksUseCase from '^/usecase/task/fetchTasksUseCase';
import BaseController from './shared/baseController';

export default class FetchTasksController extends BaseController<TaskDto[]> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(FetchTasksUseCase) private useCase: FetchTasksUseCase,
  ) {
    super();
  }

  protected async execute(): Promise<Result<TaskDto[]> | void> {
    const userSession = await this.userSessionProvider.getUserSession(this.getAuthorizationHeader());
    return {
      data: await this.useCase.invoke(userSession),
    };
  }
}
