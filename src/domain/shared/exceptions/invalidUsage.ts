import DomainException from './domainException';

export default class InvalidUsage extends DomainException {
  public constructor(reason?: string) {
    super('使用方法が正しくありません', { reason });
  }
}
