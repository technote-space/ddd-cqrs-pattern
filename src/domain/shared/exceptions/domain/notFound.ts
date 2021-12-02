import Exception from './exception';

export default class NotFound extends Exception {
  public constructor(target: string, table?: string, id?: string) {
    super(`${target}が見つかりません`, { table, id });
  }
}
