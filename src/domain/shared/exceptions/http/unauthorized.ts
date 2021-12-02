import Exception from './exception';

export default class Unauthorized extends Exception {
  public constructor() {
    super('Unauthorized', 401);
  }
}
