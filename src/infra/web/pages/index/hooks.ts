import type { Props } from '$/web/pages';
import type { IAuth, UserResult } from '$/web/shared/auth';
import type { client } from '@/web/shared/api';
import useAspidaSWR from '@aspida/swr';

const getAuthorization = (user: UserResult): string => {
  console.log(user);
  if (!user.isLoggedIn) {
    return '';
  }

  return user.user.authorization;
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth, api: typeof client) => {
  const user = auth.useUser();
  const handleLogout = auth.useLogout();

  const { data: tasks } = useAspidaSWR(
    api.tasks,
    {
      headers: { authorization: getAuthorization(user) },
      enabled: user.isLoggedIn,
    },
  );

  return {
    user,
    handleLogout,
    tasks,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
