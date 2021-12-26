import type { ValidationErrors } from '$/shared/exceptions/domain/validation';
import type { ValidationError } from '$/shared/valueObject/base';
import InvalidValueException from '$/shared/exceptions/domain/invalidValue';
import ValidationException from '$/shared/exceptions/domain/validation';

export default abstract class Base {
  protected constructor() {
    //
  }

  public getErrors(): ValidationErrors {
    return Object.keys(this).reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member = this[key as keyof this] as any;
      if (member && 'validate' in member && 'collections' in member) {
        const errors: ValidationErrors | undefined = member.validate();
        if (errors) {
          return Object.entries(errors).reduce((acc, [key, value]) => {
            return {
              ...acc,
              [key]: [...new Set([...(acc[key] ?? []), ...value])],
            };
          }, acc);
        }
      }

      if (member && 'validate' in member) {
        const name = key.replace(/^_/, '');
        const errors: ValidationError[] | undefined = member.validate(name);
        if (errors?.length) {
          return errors.reduce((acc, error) => {
            return {
              ...acc,
              [error.name]: [...new Set([...(acc[error.name] ?? []), error.error])],
            };
          }, acc);
        }
      }

      return acc;
    }, {} as ValidationErrors);
  }

  public validate(): void | never {
    const errors = this.getErrors();
    if (Object.keys(errors).length) {
      throw new ValidationException(errors);
    }
  }

  protected checkNotEmpty(property: string): void | never {
    const keys = Object.keys(this);
    if (!keys.includes(property)) {
      throw new InvalidValueException(property, 'プロパティが存在しません');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const member = this[property as keyof this] as any;
    if (!member || !('value' in member) || !member.value) {
      throw new InvalidValueException(property, 'プロパティの値が空です');
    }
  }
}
