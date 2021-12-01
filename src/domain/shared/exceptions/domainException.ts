export default class DomainException extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(message: string, public readonly context?: any) {
    super(message);
  }
}
