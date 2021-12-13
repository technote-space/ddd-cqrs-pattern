import type { Props } from '$/web/pages';
import type { IApi } from '$/web/shared/api';
import type { IAuth, UserResult } from '$/web/shared/auth';
import dayjs from 'dayjs';
import { useCallback } from 'react';

const getAuthorization = (user: UserResult): string => {
  /* istanbul ignore next */
  if (!user.isLoggedIn) {
    return '';
  }

  return user.user.authorization;
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth, api: IApi) => {
  const user = auth.useUser();
  const onLogout = auth.useLogout();
  const caller = api.useCaller();
  const { data: tasks, mutate, isValidating } = api.useSWR(client => [client.tasks, {
    headers: { authorization: getAuthorization(user) },
    enabled: user.isLoggedIn,
  }]);
  const onDelete = useCallback((id: string) => {
    console.log(id);
    caller(client => client.tasks._taskId(id).delete({ headers: { authorization: getAuthorization(user) } })).then(() => mutate());
  }, [user, caller, mutate]);
  const onAdd = useCallback(() => {
    caller(client => client.tasks.post({
      body: {
        タスク名: '追加テスト',
        メモ: '追加テストのメモ',
        ステータス: '登録',
        期日: dayjs().add(5, 'days').toISOString(),
        作業見積: 3,
        作業見積単位: '日',
        タグ: ['追加テストのタグ１', '追加テストのタグ２'],
      }, headers: { authorization: getAuthorization(user) },
    })).then(() => mutate());
  }, [user, caller, mutate]);
  const onUpdate = useCallback((id: string) => {
    caller(client => client.tasks._taskId(id).put({
      body: {
        タスク名: '更新テスト',
        メモ: null,
        ステータス: '実行中',
        期日: null,
        作業見積: null,
        作業見積単位: '時間',
        タグ: ['更新テストのタグ１'],
      }, headers: { authorization: getAuthorization(user) },
    })).then(() => mutate());
  }, [user, caller, mutate]);

  return {
    user,
    onLogout,
    tasks,
    isValidating,
    onAdd,
    onUpdate,
    onDelete,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
