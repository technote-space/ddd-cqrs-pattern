// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Payload = Record<string, any>;
export type JwtPayload<T extends Payload> = {
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
} & T;

export default interface IJwt<T extends Payload> {
  sign(payload: T, secret: string): string;

  verify(token: string, secret: string): JwtPayload<T>;
}
