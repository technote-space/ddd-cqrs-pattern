import { singleton, inject } from 'tsyringe';
import UseCaseBase from '^/usecase/useCaseBase';

type MigrationProperty =
  { title: {} } | // eslint-disable-line @typescript-eslint/ban-types
  { rich_text: {} } | // eslint-disable-line @typescript-eslint/ban-types
  { date: {} } | // eslint-disable-line @typescript-eslint/ban-types
  { number: { format: string } } |
  { relation: { database_id: string } }
type MigrationSchema = {
  title: {
    type: 'text',
    text: {
      content: string;
      link: null;
    };
  }[];
  properties: Record<string, MigrationProperty>;
};
export type MigrationSchemas = Record<string, MigrationSchema>;

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
