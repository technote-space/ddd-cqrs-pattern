import type { ISlack } from '$/server/shared/slack';
import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject, singleton } from 'tsyringe';
import FetchTasksUseCase from '^/usecase/task/fetchTasksUseCase';
import BaseController from './shared/baseController';

@singleton()
export default class FetchTasksController extends BaseController<TaskDto[]> {
  public constructor(
    @inject('ISlack') slack: ISlack,
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(FetchTasksUseCase) private useCase: FetchTasksUseCase,
  ) {
    super(slack);
  }

  protected async execute(): Promise<Result<TaskDto[]> | void> {
    return {
      data: await this.useCase.invoke(await this.userSessionProvider.getUserSession(this.getAuthorizationHeader())),
    };
  }
}
