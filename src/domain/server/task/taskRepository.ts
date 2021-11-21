import Task from './task';
import TaskId from './valueObject/taskId';

export default interface ITaskRepository {
  findById(taskId: TaskId): Task;

  save(task: Task): void;
}
