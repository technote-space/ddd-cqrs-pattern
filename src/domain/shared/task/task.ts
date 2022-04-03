import type Tags from '$/shared/tag/tags';
import type UserId from '$/shared/user/valueObject/userId';
import type DueDate from './valueObject/dueDate';
import type Estimate from './valueObject/estimate';
import type Memo from './valueObject/memo';
import type Status from './valueObject/status';
import type TaskName from './valueObject/taskName';
import Entity from '@technote-space/vo-entity-ts/dist/entity';
import TaskId from './valueObject/taskId';

type OverrideType = {
  taskName?: TaskName,
  memo?: Memo | null,
  status?: Status,
  dueDate?: DueDate | null,
  estimate?: Estimate | null,
  tags?: Tags,
};
export default class Task extends Entity {
  public constructor(
    public readonly taskId: TaskId,
    public readonly taskName: TaskName,
    public readonly memo: Memo | null,
    public readonly status: Status,
    public readonly dueDate: DueDate | null,
    public readonly estimate: Estimate | null,
    public readonly userId: UserId,
    public readonly tags: Tags,
  ) {
    super();
  }

  public equals(other: Task): boolean {
    return this.taskId.equals(other.taskId);
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
    return Task._create(TaskId.create(null), taskName, memo, status, dueDate, estimate, userId, tags);
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
    return Task._reconstruct(taskId, taskName, memo, status, dueDate, estimate, userId, tags);
  }

  private update({
    taskName,
    memo,
    status,
    dueDate,
    estimate,
    tags,
  }: { taskName?: TaskName; memo?: Memo | null; status?: Status; dueDate?: DueDate | null; estimate?: Estimate | null; tags?: Tags }): Task {
    return Task._update(this, this.taskId, taskName ?? this.taskName, memo ?? this.memo, status ?? this.status, dueDate ?? this.dueDate, estimate ?? this.estimate, this.userId, tags ?? this.tags);
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

  private getUpdateValue<T extends OverrideType, K extends keyof T>(override: T | undefined, key: K) {
    return override && override[key] !== undefined ? override[key] : (this as any)[key]; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  public copy(override?: OverrideType): Task {
    return this.update({
      taskName: this.getUpdateValue(override, 'taskName'),
      memo: this.getUpdateValue(override, 'memo'),
      status: this.getUpdateValue(override, 'status'),
      dueDate: this.getUpdateValue(override, 'dueDate'),
      estimate: this.getUpdateValue(override, 'estimate'),
      tags: this.getUpdateValue(override, 'tags'),
    });
  }

  public restore(): Task {
    return this.copy({ status: this.status.onRestore() });
  }
}
