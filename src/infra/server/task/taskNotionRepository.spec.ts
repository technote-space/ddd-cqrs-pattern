import type IDatabase from '$/server/shared/database';
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
import TaskNotionRepository from '@/server/task/taskNotionRepository';

describe('TaskNotionRepository', () => {
  describe('findById', () => {
    it('指定されたIDのタスクを取得', async () => {
      const mockFind = jest.fn(() => Promise.resolve({
        id: 'test',
        タスク名: 'タスク',
        ステータス: '登録',
        タグ: [{ id: 'test1', value: '宿題' }, { id: 'test2', value: 'テスト' }],
        メモ: 'メモメモ',
        ユーザー: { id: 'user', value: 'テストユーザー' },
        作業見積: 10,
        作業見積単位: '日',
        期日: '2022-01-01T10:00:00+09:00',
      }));
      const repository = new TaskNotionRepository({ find: mockFind } as never as IDatabase);

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
        タスク名: 'タスク',
        ステータス: '登録',
        タグ: [],
        メモ: null,
        ユーザー: { id: 'user', value: 'テストユーザー' },
        作業見積: null,
        作業見積単位: null,
        期日: null,
      }));
      const repository = new TaskNotionRepository({ find: mockFind } as never as IDatabase);

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
      const repository = new TaskNotionRepository({ find: mockFind } as never as IDatabase);

      await expect(repository.findById(TaskId.create('test'))).rejects.toThrow('タスクが見つかりません');
      expect(mockFind).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('タスクIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({
        id: '1234567890',
        タグ: [{ value: 'tag1', id: 'tag-id1' }],
      }));
      const repository = new TaskNotionRepository({ create: mockCreate } as never as IDatabase);

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
        ステータス: '登録',
        タグ: ['tag1', 'tag2', 'tag3'],
        タスク名: 'name',
        メモ: 'memo',
        ユーザー: 'user',
        作業見積: 10,
        作業見積単位: '日',
        期日: '2022-01-01T01:00:00.000Z',
      });
      expect(task.taskId.value).toBe('1234567890');
      expect(task.tags.collections[0].tagId.isSetId()).toBe(true);
      expect(task.tags.collections[0].tagId.value).toBe('tag-id1');
      expect(task.tags.collections[1].tagId.isSetId()).toBe(false);
      expect(task.tags.collections[2].tagId.isSetId()).toBe(true);
    });

    it('タスクIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve(null));
      const repository = new TaskNotionRepository({ update: mockUpdate } as never as IDatabase);

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
        ステータス: '登録',
        タグ: [],
        タスク名: 'name',
        メモ: null,
        ユーザー: 'user',
        作業見積: null,
        作業見積単位: null,
        期日: null,
      });
    });
  });

  describe('delete', () => {
    it('指定されたIDのタスクを削除', async () => {
      const mockDelete = jest.fn(() => Promise.resolve(true));
      const repository = new TaskNotionRepository({ delete: mockDelete } as never as IDatabase);

      await repository.delete(TaskId.create('test'));
      expect(mockDelete).toBeCalledTimes(1);
    });
  });
});
