export default class InvalidControl extends Error {
  public constructor() {
    super('その操作は許可されていません');
  }
}
