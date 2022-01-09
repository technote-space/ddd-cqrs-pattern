import type { UserSession } from '^/usecase/shared/userSession';
import { IncomingHttpHeaders } from 'http';

export type AuthHeader = Required<Pick<IncomingHttpHeaders, 'authorization'>>;

export default interface IUserSessionProvider {
  getUserSession(authorization?: string): Promise<UserSession>;
}
