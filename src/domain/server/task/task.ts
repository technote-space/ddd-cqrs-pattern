import type Tags from '$/server/tag/tags';
import type UserId from '$/server/user/valueObject/userId';
import type DueDate from './valueObject/dueDate';
import type Estimate from './valueObject/estimate';
import type Memo from './valueObject/memo';
import type Status from './valueObject/status';
import type TaskName from './valueObject/taskName';
import Base from '$/shared/entity/base';
import TaskId from './valueObject/taskId';

export default class Task extends Base {
  private _taskId!: TaskId;
  private _taskName!: TaskName;
  private _memo!: Memo | null;
  private _status!: Status;
  private _dueDate!: DueDate | null;
  private _estimate!: Estimate | null;
  private _userId!: UserId;
  private _tags!: Tags;

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

  public get tags(): Tags {
    return this._tags;
  }

  public static reconstruct(
    taskId: TaskId,
    taskName: TaskName,
    memo: Memo | null,
    status: Status,
    dueDate: DueDate | null,
    estimate: Estimate | null,
    userId: UserId,
    tags: Tags,
  ): Task {
    const instance = new this();
    instance._taskId = taskId;
    instance._taskName = taskName;
    instance._memo = memo;
    instance._status = status;
    instance._dueDate = dueDate;
    instance._estimate = estimate;
    instance._userId = userId;
    instance._tags = tags;

    return instance;
  }

  public static create(
    taskName: TaskName,
    memo: Memo | null,
    status: Status,
    dueDate: DueDate | null,
    estimate: Estimate | null,
    userId: UserId,
    tags: Tags,
  ): Task {
    const instance = Task.reconstruct(TaskId.create(null), taskName, memo, status, dueDate, estimate, userId, tags);
    instance.validate();

    return instance;
  }

  private compareDate(otherTask: this): number {
    if (!this.dueDate) {
      return -1;
    }

    if (!otherTask.dueDate) {
      return 1;
    }

    return this.dueDate.compare(otherTask.dueDate);
  }

  public compare(otherTask: this): number {
    const statusCompare = this.status.compare(otherTask.status);
    if (!statusCompare) {
      if (!this.dueDate && !otherTask.dueDate) {
        return 0;
      }

      if (this.status.isAscendStatus()) {
        return this.compareDate(otherTask);
      }

      return -this.compareDate(otherTask);
    }

    return statusCompare;
  }

  public update(
    taskName: TaskName,
    memo: Memo | null,
    status: Status,
    dueDate: DueDate | null,
    estimate: Estimate | null,
    tags: Tags,
  ): Task {
    const task = Task.reconstruct(
      this.taskId,
      taskName,
      memo,
      status,
      dueDate,
      estimate,
      this.userId,
      tags,
    );
    task.validate();

    return task;
  }

  public restore(): Task {
    return this.update(
      this.taskName,
      this.memo,
      this.status.onRestore(),
      this.dueDate,
      this.estimate,
      this.tags,
    );
  }
}
