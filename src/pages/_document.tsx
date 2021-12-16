import type { IDocument } from '$/web/document';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';

export default container.resolve<IDocument>('IDocument').create();
