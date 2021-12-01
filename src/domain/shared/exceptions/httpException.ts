export default class HttpException extends Error {
  public constructor(message: string, public readonly code: number) {
    super(message);
  }
}
