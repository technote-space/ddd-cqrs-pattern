import HttpException from './httpException';

export default class Unauthorized extends HttpException {
  public constructor() {
    super('Unauthorized', 401);
  }
}