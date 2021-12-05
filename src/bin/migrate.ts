import 'reflect-metadata';
import '^/config/registry.migration';
import dotenv from 'dotenv';
import { container } from 'tsyringe';
import MigrationUseCase from '^/usecase/migrationUseCase';

dotenv.config();
(async () => {
  await container.resolve(MigrationUseCase).invoke();
})();
