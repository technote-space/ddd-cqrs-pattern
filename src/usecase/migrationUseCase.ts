import type { CreateTableParam } from '$/server/shared/database';
import { singleton, inject } from 'tsyringe';
import UseCaseBase from '^/usecase/useCaseBase';

export type MigrationSchemas = CreateTableParam[];

@singleton()
export default class MigrationUseCase extends UseCaseBase {
  public constructor(
    @inject('MigrationSchemas') private schemas: MigrationSchemas,
  ) {
    super();
  }

  public async* invoke(): AsyncGenerator<string> {
    // 生成済みのテーブル一覧を取得

    // 存在しないテーブル一覧を算出

    // 存在しないテーブルをそれぞれ作成
  }
}
