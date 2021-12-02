export default class Exception extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(message: string, public readonly context?: any) {
    super(message);
  }
}
