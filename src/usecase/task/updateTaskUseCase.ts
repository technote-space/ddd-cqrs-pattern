import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject, injectable } from 'tsyringe';
import { toEntity, fromEntity } from './taskDto';

export type UpdateData = Omit<TaskDto, 'id'>;

@injectable()
export default class UpdateTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, taskId: TaskId, data: UpdateData) {
    const task = await this.repository.findById(taskId);
    task.updateByEntity(toEntity(userSession.userId, data));
    await this.repository.save(task);

    return fromEntity(task);
  }
}
