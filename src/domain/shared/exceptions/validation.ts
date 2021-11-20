type ValidationError = {
  name: string;
  errors: string[];
};
export type ValidationErrors = {
  [id: string]: ValidationError
};

export default class ValidationException extends Error {
  public constructor(public readonly errors?: ValidationErrors) {
    super('バリデーションエラーが発生しました');
  }
}
