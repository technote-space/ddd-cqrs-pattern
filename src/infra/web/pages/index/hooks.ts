import type { Props } from '$/web/pages';
import type { IAuth, UserResult } from '$/web/shared/auth';
import type { client } from '@/web/shared/api';
import useAspidaSWR from '@aspida/swr';
import dayjs from 'dayjs';
import { useCallback } from 'react';

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
  const { data: tasks, mutate } = useAspidaSWR(
    api.tasks,
    {
      headers: { authorization: getAuthorization(user) },
      enabled: user.isLoggedIn,
    },
  );
  const handleDelete = useCallback((id: string) => {
    console.log(id);
    api.tasks._taskId(id).delete({ headers: { authorization: getAuthorization(user) } }).then(() => mutate());
  }, [user, api.tasks, mutate]);
  const handleAdd = useCallback(() => {
    api.tasks.post({
      body: {
        タスク名: '追加テスト',
        メモ: '追加テストのメモ',
        ステータス: '登録',
        期日: dayjs().add(5, 'days').toISOString(),
        作業見積: 3,
        作業見積単位: '日',
        タグ: ['追加テストのタグ１', '追加テストのタグ２'],
      }, headers: { authorization: getAuthorization(user) },
    }).then(() => mutate());
  }, [user, api.tasks, mutate]);
  const handleUpdate = useCallback((id: string) => {
    api.tasks._taskId(id).put({
      body: {
        タスク名: '更新テスト',
        メモ: null,
        ステータス: '実行中',
        期日: null,
        作業見積: null,
        作業見積単位: '時間',
        タグ: ['更新テストのタグ１'],
      }, headers: { authorization: getAuthorization(user) },
    }).then(() => mutate());
  }, [user, api.tasks, mutate]);

  return {
    user,
    handleLogout,
    tasks,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
