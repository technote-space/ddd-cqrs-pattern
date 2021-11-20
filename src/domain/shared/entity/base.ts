import type { ValidationErrors } from '$/shared/exceptions/validation';
import InvalidValueException from '$/shared/exceptions/invalidValue';
import ValidationException from '$/shared/exceptions/validation';

export default abstract class Base {
  protected constructor() {
    //
  }

  public validate(): void | never {
    const errors = Object.assign({}, ...Object.keys(this).map(key => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const member = this[key as keyof this] as any;
      if (member && 'validate' in member && 'getName' in member) {
        const errors: string[] | undefined = member.validate();
        if (errors?.length) {
          const name: string = member.getName();
          return { [key]: { name, errors } };
        }
      }

      return undefined;
    }).filter((error): error is ValidationErrors => !!error));

    if (Object.keys(errors).length) {
      throw new ValidationException(errors);
    }
  }

  protected checkNotEmpty(property: string): void | never {
    const keys = Object.keys(this);
    if (!keys.includes(property)) {
      throw InvalidValueException;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const member = this[property as keyof this] as any;
    if (!member || !('value' in member) || !member.value) {
      throw InvalidValueException;
    }
  }
}
