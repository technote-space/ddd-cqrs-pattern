import Exception from './exception';

export default class Forbidden extends Exception {
  public constructor() {
    super(403, 'Forbidden');
  }
}
