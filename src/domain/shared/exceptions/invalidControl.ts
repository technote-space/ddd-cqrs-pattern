import DomainException from './domainException';

export default class InvalidControl extends DomainException {
  public constructor(reason?: string) {
    super('その操作は許可されていません', { reason });
  }
}
