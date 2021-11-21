import UserId from '$/server/user/valueObject/userId';
import Base from '$/shared/entity/base';
import DueDate from './valueObject/dueDate';
import Estimate from './valueObject/estimate';
import Memo from './valueObject/memo';
import Status from './valueObject/status';
import TaskId from './valueObject/taskId';
import TaskName from './valueObject/taskName';

export class Task extends Base {
  private _taskId!: TaskId;
  private _taskName!: TaskName;
  private _memo!: Memo | null;
  private _status!: Status;
  private _dueDate!: DueDate | null;
  private _estimate!: Estimate | null;
  private _userId!: UserId;

  public get taskId(): TaskId {
    return this._taskId;
  }

  public get taskName(): TaskName {
    return this._taskName;
  }

  public get memo(): Memo | null {
    return this._memo;
  }

  public get status(): Status {
    return this._status;
  }

  public get dueDate(): DueDate | null {
    return this._dueDate;
  }

  public get estimate(): Estimate | null {
    return this._estimate;
  }

  public get userId(): UserId {
    return this._userId;
  }

  public static reconstruct(
    taskId: TaskId,
    taskName: TaskName,
    memo: Memo | null,
    status: Status,
    dueDate: DueDate | null,
    estimate: Estimate | null,
    userId: UserId,
  ): Task {
    const instance = new this();
    instance._taskId = taskId;
    instance._taskName = taskName;
    instance._memo = memo;
    instance._status = status;
    instance._dueDate = dueDate;
    instance._estimate = estimate;
    instance._userId = userId;

    return instance;
  }

  public static create(
    taskName: TaskName,
    memo: Memo | null,
    status: Status,
    dueDate: DueDate | null,
    estimate: Estimate | null,
    userId: UserId,
  ): Task {
    return Task.reconstruct(TaskId.create(null), taskName, memo, status, dueDate, estimate, userId);
  }
}
