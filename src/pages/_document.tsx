import type { DocumentInitialProps } from 'next/dist/shared/lib/utils';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      <Html lang="ja">
        <Head/>
        <body style={{ margin: 0 }}>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
