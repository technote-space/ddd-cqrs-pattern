export default interface IEnv {
  isValid(key: string): boolean;

  getValue(key: string, defaultValue?: string): string | never;
}
