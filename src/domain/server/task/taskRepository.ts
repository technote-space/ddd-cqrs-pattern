import type Task from '$/shared/task/task';
import type TaskId from '$/shared/task/valueObject/taskId';

export default interface ITaskRepository {
  findById(taskId: TaskId): Promise<Task>;

  save(task: Task): Promise<Task>;

  delete(taskId: TaskId): Promise<void>;
}
