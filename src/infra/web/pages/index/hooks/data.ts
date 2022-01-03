import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import { useEffect, useMemo } from 'react';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { useAddProcess, useDeleteProcess } from '@/web/shared/loading';
import { reconstructEntity } from '^/usecase/task/taskDto';

export const useTasks = (auth: IAuth, api: IApi) => {
  const user = auth.useUser();
  const { data, isValidating, mutate } = api.useSWR(client => [client.tasks, {
    headers: { authorization: getAuthorization(user) },
    enabled: user.isLoggedIn,
  }]);

  const addProcess = useAddProcess();
  const deleteProcess = useDeleteProcess();
  useEffect(() => {
    if (data) {
      deleteProcess('loadingTasks');
    } else {
      addProcess('loadingTasks', 'タスク読み込み中...');
    }
  }, [data, addProcess, deleteProcess]);

  return {
    tasks: useMemo(() => data?.map(reconstructEntity), [data]),
    isValidatingTasks: isValidating,
    mutateTasks: mutate,
  };
};
