import DomainException from './domainException';

type ValidationError = {
  name: string;
  errors: string[];
};
export type ValidationErrors = {
  [id: string]: ValidationError
};

export default class ValidationException extends DomainException {
  public constructor(public readonly errors?: ValidationErrors) {
    super('バリデーションエラーが発生しました', errors);
  }
}
