import Exception from './exception';

export default class InvalidValueException extends Exception {
  public constructor(target: string, reason?: string) {
    super('無効な値です', { target, reason });
  }
}
