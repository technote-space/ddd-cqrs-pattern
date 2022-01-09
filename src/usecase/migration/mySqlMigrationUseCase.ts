import type { CreateTableParam } from '$/server/shared/database';
import type IMigrationUseCase from '^/usecase/migration';
import { execSync } from 'child_process';
import { singleton } from 'tsyringe';

export type MigrationSchemas = CreateTableParam[];

@singleton()
export default class MySqlMigrationUseCase implements IMigrationUseCase {
  public constructor() {
  }

  public async invoke(): Promise<void> {
    execSync('yarn mysql:migrate');
  }
}
