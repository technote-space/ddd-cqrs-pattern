import Base from '$/shared/entity/base';
import Memo from './memo';
import Status from './status';
import TaskId from './taskId';
import TaskName from './taskName';

export class Task extends Base {
  private taskId!: TaskId;
  private taskName!: TaskName;
  private memo!: Memo;
  private status!: Status;

  public static reconstruct(
    taskId: TaskId,
    taskName: TaskName,
    memo: Memo,
    status: Status,
  ): Task {
    const instance = new this();
    instance.taskId = taskId;
    instance.taskName = taskName;
    instance.memo = memo;
    instance.status = status;

    return instance;
  }

  public static create(
    taskName: TaskName,
    memo: Memo,
    status: Status,
  ): Task {
    return Task.reconstruct(TaskId.create(null), taskName, memo, status);
  }
}
