import type { UserResult } from '$/web/shared/auth';

export const getAuthorization = (user: UserResult): string => {
  /* istanbul ignore next */
  if (!user.isLoggedIn) {
    return '';
  }

  return user.user.authorization;
};
