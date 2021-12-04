import type { Result } from './shared/baseController';
import type { Request } from './shared/baseController';
import type IUserSessionProvider from './shared/userSessionProvider';
import { inject, container } from 'tsyringe';
import TaskId from '$/server/task/valueObject/taskId';
import DeleteTaskUseCase from '^/usecase/task/deleteTaskUseCase';
import BaseController from './shared/baseController';

export default class DeleteTaskController extends BaseController {
  public constructor(
    @inject('IUserSessionProvider') private userSessionProvider: IUserSessionProvider,
  ) {
    super();
  }

  protected async execute(request: Request): Promise<Result | void> {
    const userSession = await this.userSessionProvider.getUserSession(request.headers['authorization']);
    return {
      data: await container.resolve(DeleteTaskUseCase).invoke(userSession, TaskId.create(request.query['taskId'] as string)),
    };
  }
}
