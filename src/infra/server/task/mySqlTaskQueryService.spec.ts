import dayjs from 'dayjs';
import UserId from '$/shared/user/valueObject/userId';
import MySqlTaskRepository from '@/server/task/mySqlTaskRepository';
import MySqlTaskQueryService from './mySqlTaskQueryService';

describe('MySqlTaskQueryService', () => {
  describe('findByUser', () => {
    it('ユーザーのタスク一覧を取得する', async () => {
      const mockFindMany = jest.fn(() => Promise.resolve([
        {
          id: 1,
          taskName: 'name1',
          memo: 'memo1',
          status: '登録',
          dueDate: dayjs('2022-01-01T01:00:00.000Z').toDate(),
          estimateValue: 10,
          estimateUnit: '日',
          userId: 3,
          user: { id: 3 },
          tags: [{ id: 4, tagName: 'Tag1' }, { id: 5, tagName: 'Tag2' }, { id: 6, tagName: 'Tag3' }],
        },
        {
          id: 2,
          taskName: 'name2',
          memo: null,
          status: '登録',
          dueDate: null,
          estimateValue: null,
          estimateUnit: null,
          userId: 3,
          user: { id: 3 },
          tags: [],
        },
      ]));
      const queryService = new MySqlTaskQueryService({ task: { findMany: mockFindMany } } as never);

      const userId = UserId.create('3');
      const results = await queryService.findByUser(userId);

      expect(mockFindMany).toBeCalledWith({
        where: {
          userId: 3,
        },
        include: MySqlTaskRepository.getIncludeArgs(),
      });

      expect(results).toHaveLength(2);
      expect(results[0].taskId.value).toBe('2');
      expect(results[0].taskName.value).toBe('name2');
      expect(results[0].memo).toBeNull();
      expect(results[0].status.value).toBe('登録');
      expect(results[0].dueDate).toBeNull();
      expect(results[0].estimate).toBeNull();
      expect(results[0].userId.value).toBe('3');
      expect(results[0].tags.collections).toHaveLength(0);

      expect(results[1].taskId.value).toBe('1');
      expect(results[1].taskName.value).toBe('name1');
      expect(results[1].memo?.value).toBe('memo1');
      expect(results[1].status.value).toBe('登録');
      expect(results[1].dueDate?.value.toISOString()).toBe('2022-01-01T01:00:00.000Z');
      expect(results[1].estimate?.value.value.value).toBe(10);
      expect(results[1].estimate?.value.unit.value).toBe('日');
      expect(results[1].userId.value).toBe('3');
      expect(results[1].tags.collections).toHaveLength(3);
      expect(results[1].tags.collections[0].tagName.value).toBe('Tag1');
      expect(results[1].tags.collections[1].tagName.value).toBe('Tag2');
      expect(results[1].tags.collections[2].tagName.value).toBe('Tag3');
    });
  });
});
