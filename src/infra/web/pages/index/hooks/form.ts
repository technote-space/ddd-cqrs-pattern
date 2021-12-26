import type { IApi } from '$/web/shared/api';
import type { IAuth } from '$/web/shared/auth';
import type { FormValues } from '^/usecase/task/taskDto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSchema } from '@/web/helpers/form';
import { getAuthorization } from '@/web/pages/index/helpers/auth';
import { createSchema, TaskDto } from '^/usecase/task/taskDto';

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
  };
};

export const useDeleteTask = (auth: IAuth, api: IApi, deleteTargetTask: TaskDto | undefined, mutateTasks: () => void) => {
  const caller = api.useCaller();
  const user = auth.useUser();
  const onDelete = useCallback(() => {
    if (!deleteTargetTask) {
      return;
    }

    caller(client => client.tasks._taskId(deleteTargetTask.id).delete({ headers: { authorization: getAuthorization(user) } }), '削除中...').then(mutateTasks);
  }, [user, caller, deleteTargetTask, mutateTasks]);

  return {
    onDelete,
  };
};
