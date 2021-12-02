import DomainException from './domainException';

export default class NotFound extends DomainException {
  public constructor(target: string, table?: string, id?: string) {
    super(`${target}が見つかりません`, { table, id });
  }
}
