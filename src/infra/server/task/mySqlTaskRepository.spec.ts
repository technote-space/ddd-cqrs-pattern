import dayjs from 'dayjs';
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
import MySqlTaskRepository from '@/server/task/mySqlTaskRepository';

describe('MySqlTaskRepository', () => {
  describe('findById', () => {
    it('指定されたIDのタスクを取得', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve({
        id: '1',
        taskName: 'タスク',
        memo: 'メモメモ',
        status: '登録',
        dueDate: '2022-01-01T10:00:00+09:00',
        estimateValue: 10,
        estimateUnit: '日',
        user: { id: '2' },
        tags: [{ id: '3', tagName: '宿題' }, { id: '4', tagName: 'テスト' }],
      }));
      const repository = new MySqlTaskRepository({ task: { findFirst: mockFindFirst } } as never);

      const task = await repository.findById(TaskId.create('1'));
      expect(mockFindFirst).toBeCalledTimes(1);
      expect(task.taskId.value).toBe('1');
      expect(task.taskName.value).toBe('タスク');
      expect(task.memo?.value).toBe('メモメモ');
      expect(task.status.value).toBe('登録');
      expect(task.dueDate?.value.toISOString()).toBe('2022-01-01T01:00:00.000Z');
      expect(task.estimate?.value.value.value).toBe(10);
      expect(task.estimate?.value.unit.value).toBe('日');
      expect(task.userId.value).toBe('2');
      expect(task.tags.collections).toHaveLength(2);
      expect(task.tags.collections[0].tagId.value).toBe('3');
      expect(task.tags.collections[0].tagName.value).toBe('宿題');
      expect(task.tags.collections[1].tagId.value).toBe('4');
      expect(task.tags.collections[1].tagName.value).toBe('テスト');
    });

    it('null を含む指定されたIDのタスクを取得', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve({
        id: '1',
        taskName: 'タスク',
        memo: null,
        status: '登録',
        dueDate: null,
        estimateValue: null,
        estimateUnit: null,
        user: { id: '2', value: 'テストユーザー' },
        tags: [],
      }));
      const repository = new MySqlTaskRepository({ task: { findFirst: mockFindFirst } } as never);

      const task = await repository.findById(TaskId.create('1'));
      expect(mockFindFirst).toBeCalledTimes(1);
      expect(task.taskId.value).toBe('1');
      expect(task.taskName.value).toBe('タスク');
      expect(task.memo).toBeNull();
      expect(task.status.value).toBe('登録');
      expect(task.dueDate).toBeNull();
      expect(task.estimate).toBeNull();
      expect(task.userId.value).toBe('2');
      expect(task.tags.collections).toHaveLength(0);
    });

    it('指定されたIDのタスクが存在しない場合エラー', async () => {
      const mockFindFirst = jest.fn(() => Promise.resolve(null));
      const repository = new MySqlTaskRepository({ task: { findFirst: mockFindFirst } } as never);

      await expect(repository.findById(TaskId.create('1'))).rejects.toThrow('タスクが見つかりません');
      expect(mockFindFirst).toBeCalledTimes(1);
    });
  });

  describe('save', () => {
    it('タスクIDがない場合は新しく作成', async () => {
      const mockCreate = jest.fn(() => Promise.resolve({
        id: '1',
        taskName: 'name',
        memo: 'memo',
        status: '登録',
        dueDate: '2022-01-01T10:00:00+09:00',
        estimateValue: 10,
        estimateUnit: '日',
        user: { id: '2' },
        tags: [{ id: '3', tagName: 'tag1' }, { id: '4', tagName: 'tag2' }, { id: '5', tagName: 'tag3' }],
      }));
      const repository = new MySqlTaskRepository({ task: { create: mockCreate } } as never);

      const task = Task.create(
        TaskName.create('name'),
        Memo.create('memo'),
        Status.create('登録'),
        DueDate.create('2022-01-01T10:00:00+09:00'),
        Estimate.create({
          value: EstimateValue.create(10),
          unit: EstimateUnit.create('日'),
        }),
        UserId.create('2'),
        Tags.create([Tag.create(TagName.create('tag1')), Tag.create(TagName.create('tag2')), Tag.reconstruct(TagId.create('3'), TagName.create('tag3'))]),
      );
      const saved = await repository.save(task);
      expect(mockCreate).toBeCalledWith({
        data: {
          status: '登録',
          tags: {
            connectOrCreate: [
              { create: { tagName: 'tag1' }, where: { tagName: 'tag1' } },
              { create: { tagName: 'tag2' }, where: { tagName: 'tag2' } },
              { create: { tagName: 'tag3' }, where: { tagName: 'tag3' } },
            ],
          },
          taskName: 'name',
          memo: 'memo',
          user: {
            connect: {
              id: 2,
            },
          },
          estimateValue: 10,
          estimateUnit: '日',
          dueDate: dayjs('2022-01-01T01:00:00.000Z').toDate(),
        },
        include: MySqlTaskRepository.getIncludeArgs(),
      });
      expect(saved.taskId.value).toBe('1');
      expect(saved.userId.value).toBe('2');
      expect(saved.tags.collections[0].tagName.value).toBe('tag1');
      expect(saved.tags.collections[1].tagName.value).toBe('tag2');
      expect(saved.tags.collections[2].tagName.value).toBe('tag3');
    });

    it('タスクIDがある場合は更新', async () => {
      const mockUpdate = jest.fn(() => Promise.resolve({
        id: '1',
        taskName: 'name',
        memo: null,
        status: '登録',
        dueDate: null,
        estimateValue: null,
        estimateUnit: null,
        user: { id: '2' },
        tags: [],
      }));
      const repository = new MySqlTaskRepository({ task: { update: mockUpdate } } as never);

      const task = Task.reconstruct(
        TaskId.create('1'),
        TaskName.create('name'),
        null,
        Status.create('登録'),
        null,
        null,
        UserId.create('2'),
        Tags.create([]),
      );
      const saved = await repository.save(task);
      expect(mockUpdate).toBeCalledWith({
        data: {
          status: '登録',
          tags: {
            connectOrCreate: [],
            set: [],
          },
          taskName: 'name',
          memo: null,
          user: {
            connect: {
              id: 2,
            },
          },
          estimateValue: null,
          estimateUnit: null,
          dueDate: null,
        },
        where: {
          id: 1,
        },
        include: MySqlTaskRepository.getIncludeArgs(),
      });
      expect(saved.taskId.value).toBe('1');
      expect(saved.userId.value).toBe('2');
      expect(saved.tags.collections).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('指定されたIDのタスクを削除', async () => {
      const mockDelete = jest.fn(() => Promise.resolve(true));
      const repository = new MySqlTaskRepository({ task: { delete: mockDelete } } as never);

      await repository.delete(TaskId.create('1'));
      expect(mockDelete).toBeCalledTimes(1);
    });
  });
});
