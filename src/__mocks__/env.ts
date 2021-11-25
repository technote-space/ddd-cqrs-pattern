import type IEnv from '$/server/shared/env';
import { mockNotionBaseUrl } from '^/__mocks__/server';

export default class TestEnv implements IEnv {
  public constructor(private env: Record<string, string>) {
    this.env.NOTION_BASE_URL = mockNotionBaseUrl;
  }

  public getValue(key: string): string | never {
    if (!(key in this.env)) {
      throw Error('環境変数が設定されていません: ' + key);
    }

    const env = this.env[key];
    if (env === undefined) {
      throw Error('環境変数が設定されていません: ' + key);
    }

    return env;
  }
}
