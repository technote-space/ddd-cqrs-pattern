import type { ISlack } from '$/server/shared/slack';
import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject, singleton } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import RestoreTaskUseCase from '^/usecase/task/restoreTaskUseCase';
import BaseController from './shared/baseController';

@singleton()
export default class RestoreTaskController extends BaseController<TaskDto> {
  public constructor(
    @inject('ISlack') slack: ISlack,
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(RestoreTaskUseCase) private useCase: RestoreTaskUseCase,
  ) {
    super(slack);
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(this.getAuthorizationHeader());
    return {
      data: await this.useCase.invoke(userSession, TaskId.create(this.getQuery('taskId'))),
    };
  }
}
