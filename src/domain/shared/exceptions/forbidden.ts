import HttpException from './httpException';

export default class Unauthorized extends HttpException {
  public constructor() {
    super('Forbidden', 403);
  }
}
