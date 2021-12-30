import Tag from '$/server/tag/tag';
import Tags from '$/server/tag/tags';
import TagName from '$/server/tag/valueObject/tagName';
import DueDate from '$/server/task/valueObject/dueDate';
import Estimate from '$/server/task/valueObject/estimate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';
import Task from './task';

describe('Task', () => {
  describe('update', () => {
    it('値を更新する', () => {
      const task = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task'),
        Memo.create('memo'),
        Status.create('登録'),
        null,
        null,
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag'))]),
      );

      task.update(
        TaskName.create('task2'),
        Memo.create('memo2'),
        Status.create('実行中'),
        DueDate.create('2022-01-01'),
        Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('時間') }),
        Tags.create([Tag.create(TagName.create('tag1')), Tag.create(TagName.create('tag2'))]),
      );

      expect(task.taskId.value).toBe('id');
      expect(task.taskName.value).toBe('task2');
      expect(task.memo?.value).toBe('memo2');
      expect(task.status.value).toBe('実行中');
      expect(task.dueDate?.value.toISOString()).toBe('2021-12-31T15:00:00.000Z');
      expect(task.estimate?.value.value.value).toBe(10);
      expect(task.estimate?.value.unit.value).toBe('時間');
      expect(task.userId.value).toBe('user');
      expect(task.tags.collections).toHaveLength(2);
      expect(task.tags.collections[0].tagName.value).toBe('tag1');
      expect(task.tags.collections[1].tagName.value).toBe('tag2');
    });
  });

  describe('updateByEntity', () => {
    it('別のEntityで値を更新する', () => {
      const task = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task'),
        Memo.create('memo'),
        Status.create('登録'),
        null,
        null,
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag'))]),
      );

      const other = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task2'),
        Memo.create('memo2'),
        Status.create('実行中'),
        DueDate.create('2022-01-01'),
        Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('時間') }),
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag1')), Tag.create(TagName.create('tag2'))]),
      );

      task.updateByEntity(other);

      expect(task.taskId.value).toBe('id');
      expect(task.taskName.value).toBe('task2');
      expect(task.memo?.value).toBe('memo2');
      expect(task.status.value).toBe('実行中');
      expect(task.dueDate?.value.toISOString()).toBe('2021-12-31T15:00:00.000Z');
      expect(task.estimate?.value.value.value).toBe(10);
      expect(task.estimate?.value.unit.value).toBe('時間');
      expect(task.userId.value).toBe('user');
      expect(task.tags.collections).toHaveLength(2);
      expect(task.tags.collections[0].tagName.value).toBe('tag1');
      expect(task.tags.collections[1].tagName.value).toBe('tag2');
    });

    it('異なるユーザーのEntityの場合はエラー', () => {
      const task = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task'),
        Memo.create('memo'),
        Status.create('登録'),
        null,
        null,
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag'))]),
      );

      const other = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task2'),
        Memo.create('memo2'),
        Status.create('実行中'),
        DueDate.create('2022-01-01'),
        Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('時間') }),
        UserId.create('user2'),
        Tags.create([Tag.create(TagName.create('tag1')), Tag.create(TagName.create('tag2'))]),
      );

      expect(() => task.updateByEntity(other)).toThrow('Forbidden');
    });
  });

  describe('compare', () => {
    const createTask = (status: string, dueDate?: string) => Task.reconstruct(
      TaskId.create('id'),
      TaskName.create('task'),
      null,
      Status.create(status),
      dueDate ? DueDate.create(dueDate) : null,
      null,
      UserId.create('user'),
      Tags.create([]),
    );

    it('ステータスで比較', () => {
      expect(createTask('実行中').compare(createTask('登録'))).toBe(-1);
      expect(createTask('実行中').compare(createTask('完了'))).toBe(-1);
      expect(createTask('登録').compare(createTask('完了'))).toBe(-1);
      expect(createTask('削除(実行中)').compare(createTask('削除(登録)'))).toBe(-1);
      expect(createTask('登録').compare(createTask('削除(登録)'))).toBe(-1);
      expect(createTask('登録').compare(createTask('削除(完了)'))).toBe(-1);

      expect(createTask('登録').compare(createTask('実行中'))).toBe(1);
      expect(createTask('完了').compare(createTask('実行中'))).toBe(1);
      expect(createTask('完了').compare(createTask('登録'))).toBe(1);
      expect(createTask('削除(登録)').compare(createTask('削除(実行中)'))).toBe(1);
      expect(createTask('削除(登録)').compare(createTask('登録'))).toBe(1);
      expect(createTask('削除(完了)').compare(createTask('登録'))).toBe(1);
    });

    describe('同じステータスの場合', () => {
      it('どちらも日付指定無しの場合は0', () => {
        expect(createTask('登録').compare(createTask('登録'))).toBe(0);
      })

      it('登録または実行中の場合は日付昇順', () => {
        expect(createTask('登録', '2000-01-01').compare(createTask('登録', '2000-01-02'))).toBe(-1);
        expect(createTask('登録').compare(createTask('登録', '2000-01-01'))).toBe(-1);
      });

      it('それ以外の場合は日付降順', () => {
        expect(createTask('完了', '2000-01-02').compare(createTask('完了', '2000-01-01'))).toBe(-1);
        expect(createTask('完了', '2000-01-01').compare(createTask('完了'))).toBe(-1);
      });
    });
  });
});
