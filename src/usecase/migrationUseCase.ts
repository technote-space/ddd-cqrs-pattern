import type { CreateTableParam } from '$/server/shared/database';
import type IDatabase from '$/server/shared/database';
import { singleton, inject } from 'tsyringe';

export type MigrationSchemas = CreateTableParam[];

@singleton()
export default class MigrationUseCase {
  public constructor(
    @inject('MigrationSchemas') private schemas: MigrationSchemas,
    @inject('IDatabase') private database: IDatabase,
  ) {
  }

  public async invoke(): Promise<void> {
    // 生成済みのテーブル一覧を取得
    const tables = await this.database.listTables();
    console.log('tables:', tables.map(table => table.name));

    // 存在しないテーブル一覧を算出
    const notExists = this.schemas.filter(schema => !tables.some(table => table.name === schema.name));
    console.log('create tables:', notExists.map(schema => schema.name));

    // 存在しないテーブルをそれぞれ作成
    await notExists.reduce(async (prev, table) => {
      await prev;
      console.log();
      console.log('creating...', table.name);
      await this.database.createTable(table.table);
      console.log('created!');
    }, Promise.resolve());
  }
}
