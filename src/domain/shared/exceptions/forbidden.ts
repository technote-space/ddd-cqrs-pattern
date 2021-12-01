import HttpException from './httpException';

export default class Forbidden extends HttpException {
  public constructor() {
    super('Forbidden', 403);
  }
}
