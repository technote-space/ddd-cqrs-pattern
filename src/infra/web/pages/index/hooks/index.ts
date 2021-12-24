import type { Props } from '$/web/pages';
import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import { useCallback, useMemo } from 'react';
import { useOnSubmit } from '@/web/helpers/form';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { useDeleteTaskDialog, useTaskFormDialog } from '@/web/pages/index/hooks/dialog';
import { useDeleteTask, useTaskForm } from '@/web/pages/index/hooks/form';
import { FormValues } from '^/usecase/task/taskDto';
import { useTasks } from './data';

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth, api: IApi) => {
  const user = auth.useUser();
  const onLogout = auth.useLogout();

  const { mutateTasks, tasks, ...tasksProps } = useTasks(auth, api);
  const { reset, handleSubmit, ...taskFormProps } = useTaskForm();
  const { selectedTask, ...taskFormDialogProps } = useTaskFormDialog(reset, tasks);
  const { onSubmit, validationErrors } = useOnSubmit(useCallback((body: FormValues) => {
    const headers = { authorization: getAuthorization(user) };
    if (selectedTask) {
      return [client => client.tasks._taskId(selectedTask.id).put({ body, headers }), '更新中...'];
    } else {
      return [client => client.tasks.post({ body, headers }), '追加中...'];
    }
  }, [user, selectedTask]), api, mutateTasks);
  const onSubmitForm = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);
  const deleteTaskDialogProps = useDeleteTaskDialog(tasks);

  return {
    user,
    onLogout,

    tasks,
    ...tasksProps,
    ...taskFormDialogProps,
    ...deleteTaskDialogProps,
    ...useDeleteTask(auth, api, deleteTaskDialogProps.deleteTargetTask, mutateTasks),
    ...taskFormProps,
    onSubmitForm,
    selectedTask,
    validationErrors,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
