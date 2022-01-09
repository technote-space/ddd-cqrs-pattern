import { execSync } from 'child_process';
import MySqlMigrationUseCase from '^/usecase/migration/mySqlMigrationUseCase';

jest.mock('child_process');

describe('MySqlMigrationUseCase', () => {
  it('migration コマンドが実行される', async () => {
    const useCase = new MySqlMigrationUseCase();
    await useCase.invoke();

    expect(execSync).toBeCalledWith('yarn mysql:migrate');
  });
});
