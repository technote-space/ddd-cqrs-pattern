import type { Relation } from '$/server/shared/database';
import Tag from '$/server/tag/tag';
import Tags from '$/server/tag/tags';
import TagId from '$/server/tag/valueObject/tagId';
import TagName from '$/server/tag/valueObject/tagName';
import Task from '$/server/task/task';
import DueDate from '$/server/task/valueObject/dueDate';
import Estimate from '$/server/task/valueObject/estimate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';

export type DatabaseType = {
  id: string;
  タスク名: string;
  ステータス: string;
  タグ: Relation[];
  メモ: string | null;
  ユーザー: Relation;
  作業見積値: number | null;
  作業見積単位: string | null;
  期日: string | null;
};

export default class Mapper {
  public static toEntity(data: DatabaseType): Task {
    return Task.reconstruct(
      TaskId.create(data.id),
      TaskName.create(data.タスク名),
      data.メモ ? Memo.create(data.メモ) : null,
      Status.create(data.ステータス),
      data.期日 ? DueDate.create(data.期日) : null,
      data.作業見積値 && data.作業見積単位 ? Estimate.create({
        value: EstimateValue.create(data.作業見積値),
        unit: EstimateUnit.create(data.作業見積単位),
      }) : null,
      UserId.create(data.ユーザー.id),
      Tags.create(data.タグ.map(tag => Tag.reconstruct(TagId.create(tag.id), TagName.create(tag.value)))),
    );
  }
}
