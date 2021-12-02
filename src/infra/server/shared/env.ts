import type IEnv from '$/server/shared/env';
import InvalidUsage from '$/shared/exceptions/invalidUsage';

export default class Env implements IEnv {
  public getValue(key: string): string | never {
    if (!(key in process.env)) {
      throw new InvalidUsage(`環境変数が設定されていません: ${key}`);
    }

    const env = process.env[key];
    if (env === undefined) {
      throw new InvalidUsage(`環境変数が設定されていません: ${key}`);
    }

    return env;
  }
}
