import Tag from '$/shared/tag/tag';
import Tags from '$/shared/tag/tags';
import TagId from '$/shared/tag/valueObject/tagId';
import TagName from '$/shared/tag/valueObject/tagName';
import Task from '$/shared/task/task';
import DueDate from '$/shared/task/valueObject/dueDate';
import Estimate from '$/shared/task/valueObject/estimate';
import EstimateUnit from '$/shared/task/valueObject/estimateUnit';
import EstimateValue from '$/shared/task/valueObject/estimateValue';
import Memo from '$/shared/task/valueObject/memo';
import Status from '$/shared/task/valueObject/status';
import TaskId from '$/shared/task/valueObject/taskId';
import TaskName from '$/shared/task/valueObject/taskName';
import UserId from '$/shared/user/valueObject/userId';
import NotionTaskRepository from '@/server/task/notionTaskRepository';

describe('NotionTaskRepository', () => {
  describe('findById', () => {
    it('指定されたIDのタスクを取得', async () => {
      const mockFind = jest.fn(() => Promise.resolve({
        id: 'test',
        taskName: 'タスク',
        status: '登録',
        tags: [{ id: 'test1', value: '宿題' }, { id: 'test2', value: 'テスト' }],
        memo: 'メモメモ',
        user: { id: 'user', value: 'テストユーザー' },
        estimateValue: 10,
        estimateUnit: '日',
        dueDate: '2022-01-01T10:00:00+09:00',
      }));
      const repository = new NotionTaskRepository({ find: mockFind } as never);

      const task = await repository.findById(TaskId.create('test'));
      expect(mockFind).toBeCalledTimes(1);
      expect(task.taskId.value).toBe('test');
      expect(task.taskName.value).toBe('タスク');
      expect(task.memo?.value).toBe('メモメモ');
      expect(task.status.value).toBe('登録');
      expect(task.dueDate?.value.toISOString()).toBe('2022-01-01T01:00:00.000Z');
      expect(task.estimate?.value.value.value).toBe(10);
      expect(task.estimate?.value.unit.value).toBe('日');
      expect(task.userId.value).toBe('user');
      expect(task.tags.collections).toHaveLength(2);
      expect(task.tags.collections[0].tagId.value).toBe('test1');
      expect(task.tags.collections[0].tagName.value).toBe('宿題');
      expect(task.tags.collections[1].tagId.value).toBe('test2');
      expect(task.tags.collections[1].tagName.value).toBe('テスト');
    });

    it('null を含む指定されたIDのタスクを取得', async () => {
      const mockFind = jest.fn(() => Promise.resolve({
        id: 'test',
        taskName: 'タスク',
        status: '登録',
        tags: [],
        memo: null,
        user: { id: 'user', value: 'テストユーザー' },
        estimateValue: null,
        estimateUnit: null,
        dueDate: null,
      }));
      const repository = new NotionTaskRepository({ find: mockFind } as never);

      const task = await repository.findById(TaskId.create('test'));
      expect(mockFind).toBeCalledTimes(1);
      expect(task.taskId.value).toBe('test');
      expect(task.taskName.value).toBe('タスク');
      expect(task.memo).toBeNull();
      expect(task.status.value).toBe('登録');
      expect(task.dueDate).toBeNull();
      expect(task.estimate).toBeNull();
      expect(task.userId.value).toBe('user');
      expect(task.tags.collections).toHaveLength(0);
    });

    it('指定されたIDのタスクが存在しない場合エラー', async () => {
      const mockFind = jest.fn(() => Promise.resolve(null));
      const repository = new NotionTaskRepository({ find: mockFind } as never);

      await expect(repository.findById(TaskId.create('test'))).rejects.toThrow('タスクが見つかりません');
      expect(mockFind).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('タスクIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({
        id: '1234567890',
        tags: [{ value: 'tag1', id: 'tag-id1' }],
      }));
      const repository = new NotionTaskRepository({ create: mockCreate } as never);

      const task = Task.create(
        TaskName.create('name'),
        Memo.create('memo'),
        Status.create('登録'),
        DueDate.create('2022-01-01T10:00:00+09:00'),
        Estimate.create({
          value: EstimateValue.create(10),
          unit: EstimateUnit.create('日'),
        }),
        UserId.create('user'),
        Tags.create([Tag.create(TagName.create('tag1')), Tag.create(TagName.create('tag2')), Tag.reconstruct(TagId.create('tag3'), TagName.create('tag3'))]),
      );
      await repository.save(task);
      expect(mockCreate).toBeCalledWith('tasks', {
        status: '登録',
        tags: ['tag1', 'tag2', 'tag3'],
        taskName: 'name',
        memo: 'memo',
        user: 'user',
        estimateValue: 10,
        estimateUnit: '日',
        dueDate: '2022-01-01T01:00:00.000Z',
      });
      expect(task.taskId.value).toBe('1234567890');
      expect(task.tags.collections[0].tagId.isSetId()).toBe(true);
      expect(task.tags.collections[0].tagId.value).toBe('tag-id1');
      expect(task.tags.collections[1].tagId.isSetId()).toBe(false);
      expect(task.tags.collections[2].tagId.isSetId()).toBe(true);
    });

    it('タスクIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve(null));
      const repository = new NotionTaskRepository({ update: mockUpdate } as never);

      const task = Task.reconstruct(
        TaskId.create('id'),
        TaskName.create('name'),
        null,
        Status.create('登録'),
        null,
        null,
        UserId.create('user'),
        Tags.create([]),
      );
      await repository.save(task);
      expect(mockUpdate).toBeCalledWith('tasks', {
        id: 'id',
        status: '登録',
        tags: [],
        taskName: 'name',
        memo: null,
        user: 'user',
        estimateValue: null,
        estimateUnit: null,
        dueDate: null,
      });
    });
  });

  describe('delete', () => {
    it('指定されたIDのタスクを削除', async () => {
      const mockDelete = jest.fn(() => Promise.resolve(true));
      const repository = new NotionTaskRepository({ delete: mockDelete } as never);

      await repository.delete(TaskId.create('test'));
      expect(mockDelete).toBeCalledTimes(1);
    });
  });
});
