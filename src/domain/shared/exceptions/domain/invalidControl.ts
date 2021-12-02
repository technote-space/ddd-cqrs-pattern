import Exception from './exception';

export default class InvalidControl extends Exception {
  public constructor(reason?: string) {
    super('その操作は許可されていません', { reason });
  }
}
