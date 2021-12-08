/* eslint-disable @typescript-eslint/no-var-requires */
import type { CreateTableColumn } from '$/server/shared/database';
import TestEnv from '^/__mocks__/env';
import { useMockServer, createNotionHandler } from '^/__mocks__/server';
import NotionDatabase from '.';

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (NotionDatabase as any).$cache = undefined;
});

describe('NotionDatabase', () => {
  const retrieveDatabasesHandler = createNotionHandler('get', '/databases/:database_id', 200, (req) => {
    if (req.params['database_id'] === '12345678-a74f-4552-bde9-54b92453e1b6') {
      return require('./__fixtures__/retrieve_database_user.json');
    }
    if (req.params['database_id'] === '12345678-99ac-4de4-8d2f-f67a6bfc4aeb') {
      return require('./__fixtures__/retrieve_database_tag.json');
    }

    return require('./__fixtures__/retrieve_database_task.json');
  });
  const commonColumns = [
    { name: 'タグ', type: 'relation', relation: 'tags', multiple: true, aggregates: true },
    { name: 'ユーザー', type: 'relation', relation: 'users' },
  ] as CreateTableColumn[];
  const commonSchemas = [
    { table: 'users', name: 'ユーザー', columns: commonColumns },
    { table: 'tags', name: 'タグ', columns: commonColumns },
    { table: 'tasks', name: 'タスク', columns: commonColumns },
  ];

  describe('テーブル作成済み', () => {
    useMockServer([
      retrieveDatabasesHandler,
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
    ]);

    it('作成済みのテーブル一覧を取得する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const tables = await database.listTables();
      expect(tables).toHaveLength(3);
      expect(tables[0].name).toBe('ユーザー');
      expect(tables[1].name).toBe('タグ');
      expect(tables[2].name).toBe('タスク');

      // test cache
      const tables2 = await database.listTables();
      expect(tables2).toHaveLength(3);
      expect(tables2[0].name).toBe('ユーザー');
      expect(tables2[1].name).toBe('タグ');
      expect(tables2[2].name).toBe('タスク');
    });

    it('スキーマ定義にないテーブルは取得されない', async () => {
      const database = new NotionDatabase([
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const tables = await database.listTables();
      expect(tables).toHaveLength(1);
      expect(tables[0].name).toBe('タスク');
    });

    it('すでに作成済みのテーブルを作成しようとしても何も起こらない', async () => {
      const database = new NotionDatabase([
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));

      const table = await database.createTable('tasks');
      expect(table.id).toBe('12345678-805e-4279-802d-749613f9f84e');
      expect(table.name).toBe('タスク');
      expect(table.table).toBe('tasks');
      expect(table.columns).toHaveLength(9);
    });

    it('スキーマ定義がないテーブルを指定したらエラー', async () => {
      const database = new NotionDatabase([], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));

      await expect(database.createTable('tasks')).rejects.toThrow('使用方法が正しくありません');
    });
  });

  describe('テーブル未作成', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, {
        results: [{
          'id': '12345678-0000-0000-0000-000000000000',
          'type': 'child_database',
          'child_database': {
            'title': 'a',
          },
        }],
      }),
      createNotionHandler('get', '/databases/12345678-0000-0000-0000-000000000000', 200, { properties: {} }),
      createNotionHandler('post', '/databases', 200, require('./__fixtures__/create_database.json')),
    ]);

    it('新しいテーブルを作成する', async () => {
      const database = new NotionDatabase([
        { table: 'a', name: 'a', columns: commonColumns },
        {
          table: 'tests', name: 'test', columns: [
            { name: 'test1', type: 'title' },
            { name: 'test2', type: 'datetime' },
            { name: 'test3', type: 'int' },
            { name: 'test4', type: 'text' },
            { name: 'test5', type: 'relation', relation: 'a' },
          ],
        },
      ], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));

      const table = await database.createTable('tests');
      expect(table.id).toBe('12345678-805e-4279-802d-749613f9f84e');
      expect(table.name).toBe('test');
      expect(table.table).toBe('tests');
      expect(table.columns).toHaveLength(1);
      expect(table.columns[0].name).toBe('test');
    });
  });

  describe('データが空', () => {
    useMockServer([
      retrieveDatabasesHandler,
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('post', '/databases/:database_id/query', 200, require('./__fixtures__/query_database_empty.json')),
      createNotionHandler('delete', '/blocks/12345678-0000-0000-0000-000000000000', 404, require('./__fixtures__/object_not_found.json')),
      createNotionHandler('delete', '/blocks/12345678-0000-0000-0000-111111111111', 403, {}),
    ]);

    it('検索しても結果は空', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.search('users', {});

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('検索しても結果は空（パラメータ指定1）', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.search('users', {
        pageSize: 10,
        cursor: 'test',
        filter: [
          { property: 'test1', condition: { text: { equals: 'aaa' } } },
          { property: 'test2', condition: { int: { equals: 123 } } },
          { property: 'test3', condition: { datetime: { equals: '2020-01-01' } } },
          { property: 'test4', condition: { relation: { contains: 'bbb' } } },
        ],
        sort: { column: 'test1', direction: 'descending' },
      });

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('検索しても結果は空（パラメータ指定2）', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.search('users', {
        pageSize: 10,
        cursor: 'test',
        filter: [],
        sort: { column: 'test1', direction: 'descending' },
      });

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('存在しないデータを削除しようとしてもエラーにはならない', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.delete('tasks', '12345678-0000-0000-0000-000000000000');

      expect(result).toBe(false);
    });

    it('404以外のエラーはそのままエラーとして扱う', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      await expect(database.delete('tasks', '12345678-0000-0000-0000-111111111111')).rejects.toThrow();
    });
  });

  describe('データが存在', () => {
    useMockServer([
      retrieveDatabasesHandler,
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('post', '/databases/12345678-805e-4279-802d-749613f9f84e/query', 200, require('./__fixtures__/query_database_not_has_more.json')),
      createNotionHandler('post', '/databases/12345678-a74f-4552-bde9-54b92453e1b6/query', 200, require('./__fixtures__/query_database_users.json')),
      createNotionHandler('post', '/databases/12345678-99ac-4de4-8d2f-f67a6bfc4aeb/query', 200, require('./__fixtures__/query_database_tags.json')),
      createNotionHandler('get', '/pages/12345678-835a-4a19-a988-2e0b7c588d00', 200, require('./__fixtures__/retrieve_page.json')),
      createNotionHandler('get', '/pages/12345678-0000-0000-0000-000000000000', 404, {}),
      createNotionHandler('delete', '/blocks/12345678-835a-4a19-a988-2e0b7c588d00', 200, {}),
    ]);

    it('検索機能が動作する（リレーションのデータも取得できる）', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.search('tasks', {});

      expect(result.results).toEqual([
        {
          id: '12345678-2acd-4600-b40b-a4a8a4229178',
          'タグ': [],
          '作業見積単位': null,
          '期日': '2021-11-26T10:00:00.000+09:00',
          'ユーザー': {
            id: '12345678-f7de-4c0c-b0f3-0637fbad2764',
            value: 'test2',
          },
          'ステータス': '完了',
          'メモ': null,
          '作業見積': null,
          'タスク名': '別ユーザータスク',
        },
        {
          id: '12345678-835a-4a19-a988-2e0b7c588d87',
          'タグ': [{
            id: '12345678-3f93-456d-8379-6748cbd60655',
            value: '宿題',
          }],
          '作業見積単位': '日',
          '期日': '2021-11-29T10:00:00.000+09:00',
          'ユーザー': {
            id: '12345678-0386-4822-a079-832269ef6f01',
            value: 'test',
          },
          'ステータス': '実行中',
          'メモ': 'テスト',
          '作業見積': 10,
          'タスク名': '次のタスク',
        },
        {
          id: '12345678-9c82-40c5-8a9b-8e9dae01dfc6',
          'タグ': [{
            id: '12345678-3f93-456d-8379-6748cbd60655',
            value: '宿題',
          }, {
            id: '12345678-7353-4df6-a730-5df7bd0869b1',
            value: 'テスト',
          }],
          '作業見積単位': null,
          '期日': '2021-11-30T10:00:00.000+09:00',
          'ユーザー': {
            id: '12345678-0386-4822-a079-832269ef6f01',
            value: 'test',
          },
          'ステータス': '登録',
          'メモ': null,
          '作業見積': null,
          'タスク名': '新しいタスク',
        },
      ]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('データを取得する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.find('tasks', '12345678-835a-4a19-a988-2e0b7c588d00');

      expect(result).toEqual({
        id: '12345678-835a-4a19-a988-2e0b7c588d87',
        'タグ': [{
          id: '12345678-3f93-456d-8379-6748cbd60655',
          value: '宿題',
        }],
        '作業見積単位': '日',
        '期日': '2021-11-29T10:00:00.000+09:00',
        'ユーザー': {
          id: '12345678-0386-4822-a079-832269ef6f01',
          value: 'test',
        },
        'ステータス': '実行中',
        'メモ': 'テスト',
        '作業見積': 10,
        'タスク名': '次のタスク',
      });
    });

    it('存在しないデータを取得しようとすると null が返る', async () => {
      const database = new NotionDatabase([], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.find('tasks', '12345678-0000-0000-0000-000000000000');

      expect(result).toBeNull();
    });

    it('データを削除する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.delete('tasks', '12345678-835a-4a19-a988-2e0b7c588d00');

      expect(result).toBe(true);
    });

    it('空のIDでデータを取得しようとすると null が返る', async () => {
      const database = new NotionDatabase([], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.find('tasks', '');

      expect(result).toBeNull();
    });

    it('空のIDでデータを削除しようとしてもエラーにはならない', async () => {
      const database = new NotionDatabase([], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.delete('tasks', '');

      expect(result).toBe(false);
    });
  });

  describe('リレーションデータが作成済み', () => {
    useMockServer([
      retrieveDatabasesHandler,
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('post', '/databases/12345678-99ac-4de4-8d2f-f67a6bfc4aeb/query', 200, require('./__fixtures__/query_database_tags.json')),
      createNotionHandler('post', '/databases/12345678-a74f-4552-bde9-54b92453e1b6/query', 200, require('./__fixtures__/query_database_users_filtered.json')),
      createNotionHandler('post', '/pages', 200, require('./__fixtures__/create_page_task.json'), (req) => {
        expect(req.body).toEqual({
            parent: { database_id: '12345678-805e-4279-802d-749613f9f84e' },
            properties: {
              'タスク名': { title: [{ type: 'text', text: { content: 'テスト' } }] },
              'タグ': { relation: [{ id: '12345678-7353-4df6-a730-5df7bd0869b1' }, { id: '12345678-3f93-456d-8379-6748cbd60655' }] },
              'ユーザー': { relation: [{ id: 'test' }] },
              'ステータス': { rich_text: [{ type: 'text', text: { content: '登録' } }] },
              'メモ': { rich_text: [{ type: 'text', text: { content: 'メモメモ' } }] },
              '作業見積': { number: 10 },
              '作業見積単位': { rich_text: [{ type: 'text', text: { content: '日' } }] },
              '期日': { date: { start: '2022-01-01T10:00:00-09:00' } },
            },
          },
        );
      }),
      createNotionHandler('patch', '/pages/12345678-e6cc-4407-8083-cc5827653194', 200, require('./__fixtures__/update_page_tag.json'), (req) => {
        expect(req.body).toEqual({
            properties: {
              'タグ名': { title: [{ type: 'text', text: { content: 'お散歩' } }] },
              'ユーザー': { relation: [{ id: 'test' }] },
            },
          },
        );
      }),
      createNotionHandler('patch', '/pages/12345678-0000-0000-0000-000000000000', 404, {}),
    ]);

    it('データを作成する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.create('tasks', {
        'タスク名': 'テスト',
        'タグ': ['テスト', '宿題'],
        'ユーザー': 'test',
        'ステータス': '登録',
        'メモ': 'メモメモ',
        '作業見積': '10',
        '作業見積単位': '日',
        '期日': '2022-01-01T10:00:00-09:00',
      });

      expect(result).toEqual({
        id: '12345678-6f98-43a4-a9fc-c4df60fe1fd6',
        'タスク名': 'テスト',
        'タグ': [{
          id: '12345678-7353-4df6-a730-5df7bd0869b1',
          value: 'テスト',
        }, {
          id: '12345678-3f93-456d-8379-6748cbd60655',
          value: '宿題',
        }],
        'ユーザー': {
          id: '12345678-0386-4822-a079-832269ef6f01',
          value: 'test',
        },
        'ステータス': '登録',
        'メモ': 'メモメモ',
        '作業見積': 10,
        '作業見積単位': '日',
        '期日': '2022-01-01T10:00:00.000+09:00',
      });
    });

    it('データを更新する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.update('tags', {
        'id': '12345678-e6cc-4407-8083-cc5827653194',
        'タグ名': 'お散歩',
        'ユーザー': 'test',
      });

      expect(result).toEqual({
        id: '12345678-e6cc-4407-8083-cc5827653194',
        'タグ名': 'お散歩',
        'ユーザー': {
          id: '12345678-0386-4822-a079-832269ef6f01',
          value: 'test',
        },
      });
    });

    it('存在しないデータを更新しようとするとエラーになる', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      await expect(database.update('tags', {
        'id': '12345678-0000-0000-0000-000000000000',
        'タグ名': 'お散歩',
        'ユーザー': 'test',
      })).rejects.toThrow();
    });
  });

  describe('リレーションデータが未作成', () => {
    useMockServer([
      retrieveDatabasesHandler,
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('post', '/databases/12345678-99ac-4de4-8d2f-f67a6bfc4aeb/query', 200, require('./__fixtures__/query_database_tags_filtered.json')),
      createNotionHandler('post', '/databases/12345678-a74f-4552-bde9-54b92453e1b6/query', 200, require('./__fixtures__/query_database_users_filtered.json')),
      createNotionHandler('post', '/pages', 200, (req) => {
        if (typeof req.body === 'object' && req.body.parent.database_id === '12345678-99ac-4de4-8d2f-f67a6bfc4aeb') {
          return require('./__fixtures__/create_page_tag.json');
        }

        return require('./__fixtures__/create_page_task.json');
      }, (req) => {
        if (typeof req.body === 'object' && req.body.parent.database_id === '12345678-805e-4279-802d-749613f9f84e') {
          expect(req.body).toEqual({
              parent: { database_id: '12345678-805e-4279-802d-749613f9f84e' },
              properties: {
                'タスク名': { title: [{ type: 'text', text: { content: 'テスト' } }] },
                'タグ': { relation: [{ id: '12345678-7353-4df6-a730-5df7bd0869b1' }, { id: '12345678-e6cc-4407-8083-cc5827653194' }] },
                'ユーザー': { relation: [{ id: 'test' }] },
                'ステータス': { rich_text: [{ type: 'text', text: { content: '登録' } }] },
                'メモ': { rich_text: [{ type: 'text', text: { content: 'メモメモ' } }] },
                '作業見積': { number: 10 },
                '作業見積単位': { rich_text: [{ type: 'text', text: { content: '日' } }] },
                '期日': { date: { start: '2022-01-01T10:00:00-09:00' } },
              },
            },
          );
        }
      }),
    ]);

    it('データを作成する', async () => {
      const database = new NotionDatabase(commonSchemas, new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const result = await database.create('tasks', {
        'タスク名': 'テスト',
        'タグ': ['テスト', 'おでかけ'],
        'ユーザー': 'test',
        'ステータス': '登録',
        'メモ': 'メモメモ',
        '作業見積': '10',
        '作業見積単位': '日',
        '期日': '2022-01-01T10:00:00-09:00',
      });

      expect(result).toEqual({
          id: '12345678-6f98-43a4-a9fc-c4df60fe1fd6',
          'タスク名': 'テスト',
          'タグ': [{
            id: '12345678-7353-4df6-a730-5df7bd0869b1',
            value: 'テスト',
          }], // relationの作成パラメータ生成 と 結果のリレーション取得時 で異なるものを設定できないため
          'ユーザー': {
            id: '12345678-0386-4822-a079-832269ef6f01',
            value: 'test',
          },
          'ステータス': '登録',
          'メモ': 'メモメモ',
          '作業見積': 10,
          '作業見積単位': '日',
          '期日': '2022-01-01T10:00:00.000+09:00',
        },
      );
    });
  });
});
