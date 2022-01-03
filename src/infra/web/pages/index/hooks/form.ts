import type Task from '$/server/task/task';
import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import type { FormValues } from '@/web/helpers/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Status from '$/server/task/valueObject/status';
import { useFormSchema } from '@/web/helpers/form';
import { createSchema } from '@/web/helpers/form';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { fromEntity } from '^/usecase/task/taskDto';

export const useTaskForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(useFormSchema(createSchema)),
    mode: 'onChange',
  });

  return {
    control,
    handleSubmit,
    reset,
    isDisabled: !isValid || isSubmitting,
    isSubmitting,
  };
};

export const useRestoreTask = (auth: IAuth, api: IApi, restoreTargetTask: Task | undefined, mutateTasks: () => void) => {
  const caller = api.useCaller();
  const user = auth.useUser();
  const onRestore = useCallback(() => {
    if (!restoreTargetTask) {
      return;
    }

    caller(client => client.tasks._taskId(restoreTargetTask.taskId.value).restore.patch({ headers: { authorization: getAuthorization(user) } }), undefined, '復元中...').then(mutateTasks);
  }, [user, caller, restoreTargetTask, mutateTasks]);

  return {
    onRestore,
  };
};

export const useDeleteTask = (auth: IAuth, api: IApi, deleteTargetTask: Task | undefined, mutateTasks: () => void) => {
  const caller = api.useCaller();
  const user = auth.useUser();
  const onDelete = useCallback(() => {
    if (!deleteTargetTask) {
      return;
    }

    if (deleteTargetTask.status.equals(Status.create('削除'))) {
      caller(client => client.tasks._taskId(deleteTargetTask.taskId.value).delete({ headers: { authorization: getAuthorization(user) } }), undefined, '削除中...').then(mutateTasks);
    } else {
      const deleted = deleteTargetTask.copy({ status: deleteTargetTask.status.onDelete() });
      caller(client => client.tasks._taskId(deleteTargetTask.taskId.value).put({
        body: fromEntity(deleted),
        headers: { authorization: getAuthorization(user) },
      }), undefined, '削除中...').then(mutateTasks);
    }
  }, [user, caller, deleteTargetTask, mutateTasks]);

  return {
    onDelete,
  };
};
