import type { ISlack } from '$/server/shared/slack';
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
    @inject('ISlack') slack: ISlack,
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
    @inject(CreateTaskUseCase) private useCase: CreateTaskUseCase,
  ) {
    super(slack);
  }

  protected async execute(): Promise<Result<TaskDto> | void> {
    return {
      status: 201,
      data: await this.useCase.invoke(await this.userSessionProvider.getUserSession(this.getAuthorizationHeader()), this.getBody()),
    };
  }
}
