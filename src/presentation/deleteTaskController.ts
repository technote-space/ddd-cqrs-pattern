import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import DeleteTaskUseCase from '^/usecase/task/deleteTaskUseCase';
import BaseController from './shared/baseController';

export default class DeleteTaskController extends BaseController<TaskDto> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(DeleteTaskUseCase) private useCase: DeleteTaskUseCase,
  ) {
    super();
  }

  protected async execute(request: Request): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(request.headers['authorization']);
    return {
      data: await this.useCase.invoke(userSession, TaskId.create(request.query['taskId'] as string)),
    };
  }
}
