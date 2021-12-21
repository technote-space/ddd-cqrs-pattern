import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import { getAuthorization } from '@/web/pages/index/helpers/auth';

export const useTasks = (auth: IAuth, api: IApi) => {
  const user = auth.useUser();
  const { data, isValidating, mutate } = api.useSWR(client => [client.tasks, {
    headers: { authorization: getAuthorization(user) },
    enabled: user.isLoggedIn,
  }]);

  return {
    tasks: data,
    isValidatingTasks: isValidating,
    mutateTasks: mutate,
  };
};
