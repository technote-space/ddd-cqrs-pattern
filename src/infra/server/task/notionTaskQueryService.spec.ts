import UserId from '$/server/user/valueObject/userId';
import NotionTaskQueryService from './notionTaskQueryService';

describe('NotionTaskQueryService', () => {
  describe('findByUser', () => {
    it('ユーザーのタスク一覧を取得する', async () => {
      const mockSearch = jest.fn(() => Promise.resolve({
        results: [{
          id: 'id1',
          status: '登録',
          tags: [{ id: 'tag1', value: 'Tag1' }, { id: 'tag2', value: 'Tag2' }, { id: 'tag3', value: 'Tag3' }],
          taskName: 'name1',
          memo: 'memo1',
          user: { id: 'user', value: 'テストユーザー' },
          estimateValue: 10,
          estimateUnit: '日',
          dueDate: '2022-01-01T01:00:00.000Z',
        }, {
          id: 'id2',
          status: '登録',
          tags: [],
          taskName: 'name2',
          memo: null,
          user: { id: 'user', value: 'テストユーザー' },
          estimateValue: null,
          estimateUnit: null,
          dueDate: null,
        }],
        hasMore: false,
        cursor: null,
      }));
      const queryService = new NotionTaskQueryService({ search: mockSearch } as never);

      const userId = UserId.create('test');
      const results = await queryService.findByUser(userId);

      expect(mockSearch).toBeCalledWith('tasks', {
        filter: [{
          property: 'user',
          condition: { relation: { contains: 'test' } },
        }],
      });

      expect(results).toHaveLength(2);
      expect(results[0].taskId.value).toBe('id2');
      expect(results[0].taskName.value).toBe('name2');
      expect(results[0].memo).toBeNull();
      expect(results[0].status.value).toBe('登録');
      expect(results[0].dueDate).toBeNull();
      expect(results[0].estimate).toBeNull();
      expect(results[0].userId.value).toBe('user');
      expect(results[0].tags.collections).toHaveLength(0);

      expect(results[1].taskId.value).toBe('id1');
      expect(results[1].taskName.value).toBe('name1');
      expect(results[1].memo?.value).toBe('memo1');
      expect(results[1].status.value).toBe('登録');
      expect(results[1].dueDate?.value.toISOString()).toBe('2022-01-01T01:00:00.000Z');
      expect(results[1].estimate?.value.value.value).toBe(10);
      expect(results[1].estimate?.value.unit.value).toBe('日');
      expect(results[1].userId.value).toBe('user');
      expect(results[1].tags.collections).toHaveLength(3);
      expect(results[1].tags.collections[0].tagId.value).toBe('tag1');
      expect(results[1].tags.collections[1].tagId.value).toBe('tag2');
      expect(results[1].tags.collections[2].tagId.value).toBe('tag3');
    });
  });
});
