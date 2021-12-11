import type IEnv from '$/server/shared/env';
import InvalidUsage from '$/shared/exceptions/domain/invalidUsage';

export default class Env implements IEnv {
  public isValid(key: string): boolean {
    return key in process.env && process.env[key] !== undefined;
  }

  public getValue(key: string, defaultValue?: string): string | never {
    if (!(key in process.env)) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new InvalidUsage(`環境変数が設定されていません: ${key}`);
    }

    const env = process.env[key];
    if (env === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new InvalidUsage(`環境変数が設定されていません: ${key}`);
    }

    return env;
  }
}
