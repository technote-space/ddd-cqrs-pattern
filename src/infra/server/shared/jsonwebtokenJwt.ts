import type IJwt from '$/server/shared/jwt';
import type { Payload, JwtPayload } from '$/server/shared/jwt';
import { sign, verify, JsonWebTokenError } from 'jsonwebtoken';
import Unexpected from '$/shared/exceptions/domain/unexpected';
import Unauthorized from '$/shared/exceptions/http/unauthorized';

export default class JsonwebtokenJwt<T extends Payload> implements IJwt<T> {
  public sign(payload: T, secret: string): string {
    return sign(payload, secret);
  }

  public verify(token: string, secret: string): JwtPayload<T> {
    try {
      const decoded = verify(token, secret);
      /* istanbul ignore next */
      if (typeof decoded !== 'string') {
        /* istanbul ignore next */
        return decoded as JwtPayload<T>;
      }
    } catch (error) {
      /* istanbul ignore next */
      if (error instanceof JsonWebTokenError) {
        throw new Unauthorized();
      }
    }

    /* istanbul ignore next */
    throw new Unexpected();
  }
}
