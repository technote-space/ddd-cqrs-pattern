import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { UpdateData } from '^/usecase/task/updateTaskUseCase';
import { inject } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import UpdateTaskUseCase from '^/usecase/task/updateTaskUseCase';
import BaseController from './shared/baseController';

export default class UpdateTaskController extends BaseController<TaskDto, UpdateData> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(UpdateTaskUseCase) private useCase: UpdateTaskUseCase,
  ) {
    super();
  }

  protected async execute(request: Request<UpdateData>): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(request.headers['authorization']);
    return {
      data: await this.useCase.invoke(userSession, TaskId.create(request.query['taskId'] as string), request.body),
    };
  }
}
