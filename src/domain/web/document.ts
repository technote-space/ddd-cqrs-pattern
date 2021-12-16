// eslint-disable-next-line @next/next/no-document-import-in-page
import type NextDocument from 'next/document';

export interface IDocument {
  create(): NextDocument;
}
