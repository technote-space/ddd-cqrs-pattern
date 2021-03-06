import type { ISlack } from '$/server/shared/slack';
import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject, singleton } from 'tsyringe';
import TaskId from '$/shared/task/valueObject/taskId';
import DeleteTaskUseCase from '^/usecase/task/deleteTaskUseCase';
import BaseController from './shared/baseController';

@singleton()
export default class DeleteTaskController extends BaseController<TaskDto> {
  public constructor(
    @inject('ISlack') slack: ISlack,
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(DeleteTaskUseCase) private useCase: DeleteTaskUseCase,
  ) {
    super(slack);
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    return {
      data: await this.useCase.invoke(await this.userSessionProvider.getUserSession(this.getAuthorizationHeader()), TaskId.create(this.getQuery('taskId'))),
    };
  }
}
