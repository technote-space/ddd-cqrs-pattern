import 'reflect-metadata';
import '^/config/registry.migration';
import type IMigrationUseCase from '^/usecase/migration';
import { container } from 'tsyringe';

(async () => {
  await container.resolve<IMigrationUseCase>('IMigrationUseCase').invoke();
})();
