import Base from './base';

export default function Flags<FlagTypes extends string>() { // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  abstract class Flags extends Base<FlagTypes, FlagTypes>() {
    public validate(): string[] | undefined {
      return undefined;
    }

    public compare(value: this): number {
      return this.value.localeCompare(value.value);
    }
  }

  return Flags;
}
