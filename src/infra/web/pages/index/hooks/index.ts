import type { Props } from '$/web/pages';
import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { useAddProcess, useDeleteProcess } from '@/web/shared/loading';
import { useTasks } from './data';

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth, api: IApi) => {
  const { tasks, isValidatingTasks, mutateTasks } = useTasks(auth, api);

  const user = auth.useUser();
  const onLogout = auth.useLogout();
  const caller = api.useCaller();
  const onDelete = useCallback((id: string) => {
    console.log(id);
    caller(client => client.tasks._taskId(id).delete({ headers: { authorization: getAuthorization(user) } }), '削除中...').then(() => mutateTasks());
  }, [user, caller, mutateTasks]);
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
    }), '追加中...').then(() => mutateTasks());
  }, [user, caller, mutateTasks]);
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
    }), '更新中...').then(() => mutateTasks());
  }, [user, caller, mutateTasks]);

  const addProcess = useAddProcess();
  const deleteProcess = useDeleteProcess();
  useEffect(() => {
    if (tasks) {
      deleteProcess('loadingTasks');
    } else {
      addProcess('loadingTasks', 'タスク読み込み中...');
    }
  }, [tasks, addProcess, deleteProcess]);

  return {
    user,
    onLogout,
    tasks,
    isValidatingTasks,
    onAdd,
    onUpdate,
    onDelete,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
