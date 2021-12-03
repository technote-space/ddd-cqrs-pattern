import type { ErrorStatus } from '../exception';

export default class Exception extends Error {
  public constructor(public readonly status: ErrorStatus, message: string) {
    super(message);
  }
}
