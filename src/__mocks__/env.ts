import type IEnv from '$/server/shared/env';

export default class TestEnv implements IEnv {
  public constructor(private env: Record<string, string>) {
  }

  public getValue(key: string): string | never {
    if (!(key in this.env)) {
      throw Error();
    }

    const env = this.env[key];
    if (env === undefined) {
      throw Error();
    }

    return env;
  }
}
