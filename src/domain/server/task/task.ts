import Base from '$/shared/entity/base';
import Memo from './valueObject/memo';
import Status from './valueObject/status';
import TaskId from './valueObject/taskId';
import TaskName from './valueObject/taskName';

export class Task extends Base {
  private _taskId!: TaskId;
  private _taskName!: TaskName;
  private _memo!: Memo;
  private _status!: Status;

  public get taskId(): TaskId {
    return this._taskId;
  }

  public get taskName(): TaskName {
    return this._taskName;
  }

  public get memo(): Memo {
    return this._memo;
  }

  public get status(): Status {
    return this._status;
  }

  public static reconstruct(
    taskId: TaskId,
    taskName: TaskName,
    memo: Memo,
    status: Status,
  ): Task {
    const instance = new this();
    instance._taskId = taskId;
    instance._taskName = taskName;
    instance._memo = memo;
    instance._status = status;

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
