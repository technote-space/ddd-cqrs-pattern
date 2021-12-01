export type AuthContents = {
  sub: string;
};

export default interface IAuth {
  verify(token: string): Promise<null | AuthContents>;
}
