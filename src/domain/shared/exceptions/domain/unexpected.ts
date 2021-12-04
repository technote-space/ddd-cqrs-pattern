import Exception from './exception';

export default class Unexpected extends Exception {
  public constructor(reason?: string) {
    super(500, '予期していないエラー', { reason });
  }
}
