import type { Props } from '$/web/pages';
import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import type { FormValues } from '^/usecase/task/taskDto';
import { useCallback, useMemo, useEffect } from 'react';
import { useOnSubmit, getFormFields } from '@/web/helpers/form';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { useDeleteTaskDialog, useTaskFormDialog } from '@/web/pages/index/hooks/dialog';
import { useDeleteTask, useTaskForm } from '@/web/pages/index/hooks/form';
import { useTasks } from './data';

// eslint-disable-next-line unused-imports/no-unused-vars
export const useHooks = (props: Props, auth: IAuth, api: IApi) => {
  const user = auth.useUser();
  const { mutateTasks, tasks, ...tasksProps } = useTasks(auth, api);
  const { reset, handleSubmit, ...taskFormProps } = useTaskForm();
  const {
    selectedTask,
    handleCloseTaskFormDialog,
    isOpenTaskFormDialog,
    ...taskFormDialogProps
  } = useTaskFormDialog(reset, tasks);
  const { handleCloseDeleteTaskDialog, isOpenDeleteTaskDialog, ...deleteTaskDialogProps } = useDeleteTaskDialog(tasks);
  const afterSubmit = useCallback(() => {
    handleCloseTaskFormDialog();
    handleCloseDeleteTaskDialog();
    mutateTasks().then();
  }, [handleCloseTaskFormDialog, handleCloseDeleteTaskDialog, mutateTasks]);
  const { onSubmit, validationErrors, resetValidationErrors } = useOnSubmit(useCallback((body: FormValues) => {
    const headers = { authorization: getAuthorization(user) };
    if (selectedTask) {
      return [client => client.tasks._taskId(selectedTask.id).put({ body, headers }), undefined, '更新中...'];
    } else {
      return [client => client.tasks.post({ body, headers }), undefined, '追加中...'];
    }
  }, [user, selectedTask]), api, afterSubmit);
  const onSubmitForm = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);
  const formFields = useMemo(() => getFormFields(), []);

  useEffect(() => {
    if (isOpenTaskFormDialog || isOpenDeleteTaskDialog) {
      resetValidationErrors();
    }
  }, [isOpenTaskFormDialog, isOpenDeleteTaskDialog, resetValidationErrors]);

  return {
    user,
    tasks,
    ...tasksProps,
    ...taskFormDialogProps,
    ...deleteTaskDialogProps,
    ...useDeleteTask(auth, api, deleteTaskDialogProps.deleteTargetTask, afterSubmit),
    ...taskFormProps,
    isOpenTaskFormDialog,
    isOpenDeleteTaskDialog,
    handleCloseTaskFormDialog,
    handleCloseDeleteTaskDialog,
    onSubmitForm,
    selectedTask,
    validationErrors,
    formFields,
  };
};
export type HooksParams = ReturnType<typeof useHooks>;
