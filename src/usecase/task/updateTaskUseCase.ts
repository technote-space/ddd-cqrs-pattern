import type ITaskRepository from '$/server/task/taskRepository';
import type TaskId from '$/server/task/valueObject/taskId';
import type { TaskDto } from './taskDto';
import type { UserSession } from '^/usecase/shared/userSession';
import { inject, singleton } from 'tsyringe';
import { toEntity, fromEntity } from './taskDto';

export type UpdateData = Omit<TaskDto, 'id'>;

@singleton()
export default class UpdateTaskUseCase {
  public constructor(
    @inject('ITaskRepository') private repository: ITaskRepository,
  ) {
  }

  public async invoke(userSession: UserSession, taskId: TaskId, data: UpdateData) {
    const task = await this.repository.findById(taskId);
    const updated = task.updateByEntity(toEntity(userSession.userId, data));
    await this.repository.save(updated);

    return fromEntity(updated);
  }
}
