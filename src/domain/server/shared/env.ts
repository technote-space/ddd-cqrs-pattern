export default interface IEnv {
  getValue(key: string, defaultValue?: string): string | never;
}
