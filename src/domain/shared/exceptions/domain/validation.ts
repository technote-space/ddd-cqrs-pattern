import Exception from './exception';

type ValidationError = {
  name: string;
  errors: string[];
};
export type ValidationErrors = {
  [id: string]: ValidationError
};

export default class ValidationException extends Exception {
  public constructor(public readonly errors?: ValidationErrors) {
    super('バリデーションエラーが発生しました', errors);
  }
}
