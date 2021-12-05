import type { Result } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import type { CreateData } from '^/usecase/task/createTaskUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import { inject, singleton } from 'tsyringe';
import CreateTaskUseCase from '^/usecase/task/createTaskUseCase';
import BaseController from './shared/baseController';

@singleton()
export default class CreateTaskController extends BaseController<TaskDto, CreateData> {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(CreateTaskUseCase) private useCase: CreateTaskUseCase,
  ) {
    super();
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    const userSession = await this.userSessionProvider.getUserSession(this.getAuthorizationHeader());
    return {
      status: 201,
      data: await this.useCase.invoke(userSession, this.getBody()),
    };
  }
}
