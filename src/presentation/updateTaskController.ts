import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { UpdateData } from '^/usecase/task/updateTaskUseCase';
import { inject, injectable } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import UpdateTaskUseCase from '^/usecase/task/updateTaskUseCase';
import BaseController from './shared/baseController';

@injectable()
export default class UpdateTaskController extends BaseController<TaskDto, UpdateData> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(UpdateTaskUseCase) private useCase: UpdateTaskUseCase,
  ) {
    super();
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(this.getAuthorizationHeader());
    return {
      data: await this.useCase.invoke(userSession, TaskId.create(this.getQuery('taskId')), this.getBody()),
    };
  }
}
