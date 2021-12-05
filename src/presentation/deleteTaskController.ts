import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject, singleton } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import DeleteTaskUseCase from '^/usecase/task/deleteTaskUseCase';
import BaseController from './shared/baseController';

@singleton()
export default class DeleteTaskController extends BaseController<TaskDto> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(DeleteTaskUseCase) private useCase: DeleteTaskUseCase,
  ) {
    super();
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(this.getAuthorizationHeader());
    return {
      data: await this.useCase.invoke(userSession, TaskId.create(this.getQuery('taskId'))),
    };
  }
}
