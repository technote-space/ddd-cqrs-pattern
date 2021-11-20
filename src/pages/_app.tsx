import type { IAppService } from '$/web/app';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

export default (container.resolve('IAppService') as IAppService).create();
