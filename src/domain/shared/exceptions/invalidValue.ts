export default class InvalidValueException extends Error {
  public constructor() {
    super('無効な値です');
  }
}
