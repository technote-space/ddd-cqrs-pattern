import UserId from '$/server/user/valueObject/userId';
import NotionTaskQueryService from './notionTaskQueryService';

describe('NotionTaskQueryService', () => {
  describe('findByUser', () => {
    it('ユーザーのタスク一覧を取得する', async () => {
      const mockSearch = jest.fn(() => Promise.resolve({
        results: [{
          id: 'id1',
          ステータス: '登録',
          タグ: [{ id: 'tag1', value: 'Tag1' }, { id: 'tag2', value: 'Tag2' }, { id: 'tag3', value: 'Tag3' }],
          タスク名: 'name1',
          メモ: 'memo1',
          ユーザー: { id: 'user', value: 'テストユーザー' },
          作業見積: 10,
          作業見積単位: '日',
          期日: '2022-01-01T01:00:00.000Z',
        }, {
          id: 'id2',
          ステータス: '登録',
          タグ: [],
          タスク名: 'name2',
          メモ: null,
          ユーザー: { id: 'user', value: 'テストユーザー' },
          作業見積: null,
          作業見積単位: null,
          期日: null,
        }],
        hasMore: false,
        cursor: null,
      }));
      const queryService = new NotionTaskQueryService({ search: mockSearch } as never);

      const userId = UserId.create('test');
      const results = await queryService.findByUser(userId);

      expect(mockSearch).toBeCalledWith('tasks', {
        filter: [{
          property: 'ユーザー',
          condition: { relation: { contains: 'test' } },
        }],
        sort: {
          column: '期日',
          direction: 'descending',
        },
      });

      expect(results).toHaveLength(2);
      expect(results[0].taskId.value).toBe('id1');
      expect(results[0].taskName.value).toBe('name1');
      expect(results[0].memo?.value).toBe('memo1');
      expect(results[0].status.value).toBe('登録');
      expect(results[0].dueDate?.value.toISOString()).toBe('2022-01-01T01:00:00.000Z');
      expect(results[0].estimate?.value.value.value).toBe(10);
      expect(results[0].estimate?.value.unit.value).toBe('日');
      expect(results[0].userId.value).toBe('user');
      expect(results[0].tags.collections).toHaveLength(3);
      expect(results[0].tags.collections[0].tagId.value).toBe('tag1');
      expect(results[0].tags.collections[1].tagId.value).toBe('tag2');
      expect(results[0].tags.collections[2].tagId.value).toBe('tag3');

      expect(results[1].taskId.value).toBe('id2');
      expect(results[1].taskName.value).toBe('name2');
      expect(results[1].memo).toBeNull();
      expect(results[1].status.value).toBe('登録');
      expect(results[1].dueDate).toBeNull();
      expect(results[1].estimate).toBeNull();
      expect(results[1].userId.value).toBe('user');
      expect(results[1].tags.collections).toHaveLength(0);
    });
  });
});
