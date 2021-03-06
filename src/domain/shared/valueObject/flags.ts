import type { ValidationError } from './base';
import Base from './base';

export default function Flags<FlagTypes extends string>() { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  abstract class Flags extends Base<string, FlagTypes>() {
    public abstract get flagTypes(): FlagTypes[];

    public validate(name: string): ValidationError[] | undefined {
      if (!(this.flagTypes as string[]).includes(this.input)) {
        return [{ name, error: `定義されていないフラグです: ${this.input}` }];
      }

      return undefined;
    }

    public compare(value: this): number {
      return this.value.localeCompare(value.value);
    }
  }

  return Flags;
}
