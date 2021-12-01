import DomainException from './domainException';

export default class InvalidValueException extends DomainException {
  public constructor(target: string, reason?: string) {
    super('無効な値です', { target, reason });
  }
}
