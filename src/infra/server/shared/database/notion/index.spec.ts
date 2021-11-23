import NotionDatabase from '.';
import { useMockServer, createNotionHandler, getNotionApi } from '^/__mocks__/server';
import TestEnv from '^/__mocks__/env';
import type { CreateTableParam } from '$/server/shared/database';

describe('NotionDatabase', () => {
  describe('テーブル作成済み', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, require('./__fixtures__/retrieve_block_children.json')),
      createNotionHandler('get', '/databases/:database_id', 200, require('./__fixtures__/retrieve_database.json')),
    ]);

    it('作成済みのテーブル一覧を取得する', async () => {
      const database = new NotionDatabase(getNotionApi(), new TestEnv({ NOTION_PARENT_ID: '__block_id__' }));
      const tables = await database.listTables();
      expect(tables).toHaveLength(3);
      expect(tables[0].name).toBe('ユーザー');
      expect(tables[1].name).toBe('タグ');
      expect(tables[2].name).toBe('タスク');
    });

    it('すでに作成済みのテーブルを作成しようとしても何も起こらない', async () => {
      const database = new NotionDatabase(getNotionApi(), new TestEnv({ NOTION_PARENT_ID: '__block_id__' }));
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
      expect(table.columns).toHaveLength(8);
    });
  });

  describe('テーブル未作成', () => {
    useMockServer([
      createNotionHandler('get', '/blocks/__block_id__/children', 200, { results: [] }),
      createNotionHandler('post', '/databases', 200, require('./__fixtures__/create_database.json')),
    ]);

    it('新しいテーブルを作成する', async () => {
      const database = new NotionDatabase(getNotionApi(), new TestEnv({ NOTION_PARENT_ID: '__block_id__' }));
      const params = {
        name: 'test',
        columns: [
          { name: 'test1', type: 'title' },
          { name: 'test2', type: 'number' },
        ],
      } as CreateTableParam;

      const table = await database.createTable(params);
      expect(table.id).toBe('12345678-805e-4279-802d-749613f9f84e');
      expect(table.name).toBe('test');
      expect(table.columns).toHaveLength(1);
      expect(table.columns[0].name).toBe('test');
    });
  });

  it('複数ページのデータを取得する', () => {

  });

  it('データを取得する', () => {

  });

  it('存在しないデータを取得しようとすると null が返る', () => {

  });

  it('データを作成する', () => {

  });

  it('データを更新する', () => {

  });

  it('存在しないデータを更新しようとするとエラーになる', () => {

  });

  it('データを削除する', () => {

  });

  it('存在しないデータを削除しようとしても何も起こらない', () => {

  });
});
