import Exception from './exception';

export default class NotFound extends Exception {
  public constructor(target: string, table?: string, id?: string) {
    super(404, `${target}が見つかりません`, { table, id });
  }
}
