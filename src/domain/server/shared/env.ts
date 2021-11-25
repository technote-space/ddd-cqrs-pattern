export default interface IEnv {
  getValue(key: string): string | never;
}
