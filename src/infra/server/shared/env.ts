import type IEnv from '$/server/shared/env';

export default class Env implements IEnv {
  public getValue(key: string): string | never {
    if (!(key in process.env)) {
      throw Error();
    }

    const env = process.env[key];
    if (env === undefined) {
      throw Error();
    }

    return env;
  }
}
