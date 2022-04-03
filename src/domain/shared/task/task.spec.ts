import Tag from '$/shared/tag/tag';
import Tags from '$/shared/tag/tags';
import TagName from '$/shared/tag/valueObject/tagName';
import DueDate from '$/shared/task/valueObject/dueDate';
import Memo from '$/shared/task/valueObject/memo';
import Status from '$/shared/task/valueObject/status';
import TaskId from '$/shared/task/valueObject/taskId';
import TaskName from '$/shared/task/valueObject/taskName';
import UserId from '$/shared/user/valueObject/userId';
import Task from './task';

describe('Task', () => {
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
      expect(createTask('削除(実行中)').compare(createTask('削除(登録)'))).toBe(0);
      expect(createTask('登録').compare(createTask('削除(登録)'))).toBe(-1);
      expect(createTask('登録').compare(createTask('削除(完了)'))).toBe(-1);

      expect(createTask('登録').compare(createTask('実行中'))).toBe(1);
      expect(createTask('完了').compare(createTask('実行中'))).toBe(1);
      expect(createTask('完了').compare(createTask('登録'))).toBe(1);
      expect(createTask('削除(登録)').compare(createTask('登録'))).toBe(1);
      expect(createTask('削除(完了)').compare(createTask('登録'))).toBe(1);
    });

    describe('同じステータスの場合', () => {
      it('どちらも日付指定無しの場合は0', () => {
        expect(createTask('登録').compare(createTask('登録'))).toBe(0);
      });

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

  describe('restore', () => {
    it('タスクを復元する', () => {
      const task = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('task'),
        Memo.create('memo'),
        Status.create('削除(登録)'),
        null,
        null,
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag'))]),
      );

      const restored = task.restore();

      expect(restored.taskId.value).toBe('id');
      expect(restored.taskName.value).toBe('task');
      expect(restored.memo?.value).toBe('memo');
      expect(restored.status.value).toBe('登録');
      expect(restored.dueDate).toBeNull();
      expect(restored.estimate).toBeNull();
      expect(restored.userId.value).toBe('user');
      expect(restored.tags.collections).toHaveLength(1);
      expect(restored.tags.collections[0].tagName.value).toBe('tag');
    });
  });
});
