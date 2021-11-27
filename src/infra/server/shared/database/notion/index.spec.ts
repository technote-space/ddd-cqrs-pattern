import type { CreateTableParam, CreateTableColumn } from '$/server/shared/database';
import TestEnv from '^/__mocks__/env';
import { useMockServer, createNotionHandler } from '^/__mocks__/server';
import NotionDatabase from '.';

afterEach(() => {
  (NotionDatabase as any).$cache = undefined;
});

describe('NotionDatabase', () => {
  describe('テーブル作成済み', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('get', '/databases/:database_id', 200, require('./__fixtures__/retrieve_database.json')),
    ]);
    const commonColumns = [
      { name: 'タグ', type: 'relation', relation: 'tags', multiple: true },
      { name: 'ユーザー', type: 'relation', relation: 'users' },
    ] as CreateTableColumn[];

    it('作成済みのテーブル一覧を取得する', async () => {
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
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

    it('スキーマ定義と菜がある場合にエラーになる', async () => {
      const columns = [] as CreateTableColumn[];
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns },
        { table: 'tags', name: 'タグ', columns },
        { table: 'tasks', name: 'タスク', columns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      await expect(database.listTables()).rejects.toThrow('スキーマ定義と差異があります');
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
      const params = {
        name: 'タスク',
        columns: [
          { name: 'test1', type: 'title' },
          { name: 'test2', type: 'number' },
        ],
      } as CreateTableParam;

      const table = await database.createTable(params);
      expect(table.id).toBe('12345678-805e-4279-802d-749613f9f84e');
      expect(table.name).toBe('タスク');
      expect(table.table).toBe('tasks');
      expect(table.columns).toHaveLength(9);
    });
  });

  describe('テーブル未作成', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, { results: [] }),
      createNotionHandler('post', '/databases', 200, require('./__fixtures__/create_database.json')),
    ]);

    it('新しいテーブルを作成する', async () => {
      const database = new NotionDatabase([], new TestEnv({
        NOTION_SECRET: 'secret',
        NOTION_PARENT_ID: '__block_id__',
      }));
      const params = {
        name: 'test',
        table: 'tests',
        columns: [
          { name: 'test1', type: 'title' },
          { name: 'test2', type: 'datetime' },
          { name: 'test3', type: 'int' },
          { name: 'test4', type: 'text' },
        ],
      } as CreateTableParam;

      const table = await database.createTable(params);
      expect(table.id).toBe('12345678-805e-4279-802d-749613f9f84e');
      expect(table.name).toBe('test');
      expect(table.table).toBe('tests');
      expect(table.columns).toHaveLength(1);
      expect(table.columns[0].name).toBe('test');
    });
  });

  describe('データが空', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('get', '/databases/:database_id', 200, require('./__fixtures__/retrieve_database.json')),
      createNotionHandler('post', '/databases/:database_id/query', 200, require('./__fixtures__/query_database_empty.json')),
    ]);
    const commonColumns = [
      { name: 'タグ', type: 'relation', relation: 'tags', multiple: true },
      { name: 'ユーザー', type: 'relation', relation: 'users' },
    ] as CreateTableColumn[];

    it('検索しても結果は空', async () => {
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const result = await database.search('users', {});

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('検索しても結果は空（パラメータ指定1）', async () => {
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const result = await database.search('users', {
        pageSize: 10,
        cursor: 'test',
        filter: {
          test1: { text: { equals: 'aaa' } },
          test2: { int: { equals: 123 } },
          test3: { datetime: { equals: '2020-01-01' } },
          test4: { relation: { contains: 'bbb' } },
        },
        sort: { column: 'test1', direction: 'descending' },
      });

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });

    it('検索しても結果は空（パラメータ指定2）', async () => {
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const result = await database.search('users', {
        pageSize: 10,
        cursor: 'test',
        filter: {},
        sort: { column: 'test1', direction: 'descending' },
      });

      expect(result.results).toEqual([]);
      expect(result.hasMore).toBe(false);
      expect(result.cursor).toBe(null);
    });
  });

  describe('データが存在', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('get', '/databases/:database_id', 200, require('./__fixtures__/retrieve_database.json')),
      createNotionHandler('post', '/databases/12345678-805e-4279-802d-749613f9f84e/query', 200, require('./__fixtures__/query_database_not_has_more.json')),
      createNotionHandler('post', '/databases/12345678-a74f-4552-bde9-54b92453e1b6/query', 200, require('./__fixtures__/query_database_users.json')),
      createNotionHandler('post', '/databases/12345678-99ac-4de4-8d2f-f67a6bfc4aeb/query', 200, require('./__fixtures__/query_database_tags.json')),
      createNotionHandler('get', '/pages/12345678-835a-4a19-a988-2e0b7c588d00', 200, require('./__fixtures__/retrieve_page.json')),
      createNotionHandler('get', '/pages/12345678-0000-0000-0000-000000000000', 404, {}),
    ]);
    const commonColumns = [
      { name: 'タグ', type: 'relation', relation: 'tags', multiple: true },
      { name: 'ユーザー', type: 'relation', relation: 'users' },
    ] as CreateTableColumn[];

    it('検索機能が動作する（リレーションのデータも取得できる）', async () => {
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const result = await database.search('tasks', {});

      expect(result.results).toEqual([
        {
          id: '12345678-2acd-4600-b40b-a4a8a4229178',
          'タグ': [],
          '作業見積単位': null,
          '期日': '2021-11-26T10:00:00.000+09:00',
          'ユーザー': 'test2',
          'ステータス': '完了',
          'メモ': null,
          '作業見積': null,
          'タスク名': '別ユーザータスク',
        },
        {
          id: '12345678-835a-4a19-a988-2e0b7c588d87',
          'タグ': ['宿題'],
          '作業見積単位': '日',
          '期日': '2021-11-29T10:00:00.000+09:00',
          'ユーザー': 'test',
          'ステータス': '実行中',
          'メモ': 'テスト',
          '作業見積': 10,
          'タスク名': '次のタスク',
        },
        {
          id: '12345678-9c82-40c5-8a9b-8e9dae01dfc6',
          'タグ': ['宿題', 'テスト'],
          '作業見積単位': null,
          '期日': '2021-11-30T10:00:00.000+09:00',
          'ユーザー': 'test',
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
      const database = new NotionDatabase([
        { table: 'users', name: 'ユーザー', columns: commonColumns },
        { table: 'tags', name: 'タグ', columns: commonColumns },
        { table: 'tasks', name: 'タスク', columns: commonColumns },
      ], new TestEnv({ NOTION_SECRET: 'secret', NOTION_PARENT_ID: '__block_id__' }));
      const result = await database.find('tasks', '12345678-835a-4a19-a988-2e0b7c588d00');

      expect(result).toEqual({
        id: '12345678-835a-4a19-a988-2e0b7c588d87',
        'タグ': ['宿題'],
        '作業見積単位': '日',
        '期日': '2021-11-29T10:00:00.000+09:00',
        'ユーザー': 'test',
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
  });

  // it('データを作成する', () => {
  //
  // });
  //
  // it('データを更新する', () => {
  //
  // });
  //
  // it('存在しないデータを更新しようとするとエラーになる', () => {
  //
  // });
  //
  // it('データを削除する', () => {
  //
  // });
  //
  // it('存在しないデータを削除しようとしても何も起こらない', () => {
  //
  // });
});
