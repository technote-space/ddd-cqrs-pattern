import type { UserSession } from '^/usecase/shared/userSession';

export default interface IUserSessionProvider {
  getUserSession(authorization: string): Promise<UserSession>;
}
