import type { IApp } from '$/web/app';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';
import '^/styles/global.scss';

export default container.resolve<IApp>('IApp').create();
