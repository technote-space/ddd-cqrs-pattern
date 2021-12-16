import type { IDocument } from '$/web/document';
// eslint-disable-next-line @next/next/no-document-import-in-page
import type NextDocument from 'next/document';
import { default as NextAdapterDocument } from '@expo/next-adapter/document';
import { singleton } from 'tsyringe';

@singleton()
export default class ExpoDocument implements IDocument {
  public create(): NextDocument {
    return NextAdapterDocument as never as NextDocument;
  }
}
