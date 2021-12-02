import Exception from './exception';

export default class Forbidden extends Exception {
  public constructor() {
    super('Forbidden', 403);
  }
}
