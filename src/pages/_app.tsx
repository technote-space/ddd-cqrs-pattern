import type { IApp } from '$/web/app';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

export default container.resolve<IApp>('IApp').create();
