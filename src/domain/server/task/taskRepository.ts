import type Task from './task';
import type TaskId from './valueObject/taskId';

export default interface ITaskRepository {
  findById(taskId: TaskId): Promise<Task>;

  save(task: Task): Promise<void>;
}
