import type Task from '$/server/task/task';
import type { FormValues } from '@/web/helpers/form';
import type { UseFormReset } from 'react-hook-form/dist/types/form';
import { useState, useCallback, useMemo } from 'react';
import { getFormDefaultValues } from '@/web/helpers/form';
import { fromEntity } from '^/usecase/task/taskDto';

export const useTaskFormDialog = (reset: UseFormReset<FormValues>, tasks?: Task[]) => {
  const [isOpenTaskFormDialog, setIsOpenTaskFormDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>();

  const handleOpenAddTaskFormDialog = useCallback(() => {
    setSelectedTask(undefined);
    reset(getFormDefaultValues());
    setIsOpenTaskFormDialog(true);
  }, [reset]);
  const handleCloseTaskFormDialog = useCallback(() => {
    setIsOpenTaskFormDialog(false);
  }, []);
  const updateTaskHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...(tasks ?? []).map(task => ({
    [task.taskId.value]: () => {
      setSelectedTask(task);
      reset(fromEntity(task));
      setIsOpenTaskFormDialog(true);
    },
  }))), [tasks, reset]);

  return {
    updateTaskHandlers,
    isOpenTaskFormDialog,
    selectedTask,
    handleOpenAddTaskFormDialog,
    handleCloseTaskFormDialog,
  };
};

export const useRestoreTaskDialog = (tasks?: Task[]) => {
  const [isOpenRestoreTaskDialog, setIsOpenRestoreTaskDialog] = useState(false);
  const [restoreTargetTask, setRestoreTargetTask] = useState<Task>();
  const handleCloseRestoreTaskDialog = useCallback(() => {
    setIsOpenRestoreTaskDialog(false);
  }, []);
  const restoreTaskHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...(tasks ?? []).filter(task => task.status.isDeleted()).map(task => ({
    [task.taskId.value]: () => {
      setRestoreTargetTask(task);
      setIsOpenRestoreTaskDialog(true);
    },
  }))), [tasks]);

  return {
    isOpenRestoreTaskDialog,
    restoreTargetTask,
    restoreTaskHandlers,
    handleCloseRestoreTaskDialog,
  };
};

export const useDeleteTaskDialog = (tasks?: Task[]) => {
  const [isOpenDeleteTaskDialog, setIsOpenDeleteTaskDialog] = useState(false);
  const [deleteTargetTask, setDeleteTargetTask] = useState<Task>();
  const handleCloseDeleteTaskDialog = useCallback(() => {
    setIsOpenDeleteTaskDialog(false);
  }, []);
  const deleteTaskHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...(tasks ?? []).map(task => ({
    [task.taskId.value]: () => {
      setDeleteTargetTask(task);
      setIsOpenDeleteTaskDialog(true);
    },
  }))), [tasks]);

  return {
    isOpenDeleteTaskDialog,
    deleteTargetTask,
    deleteTaskHandlers,
    handleCloseDeleteTaskDialog,
  };
};
