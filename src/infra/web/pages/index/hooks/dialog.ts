import type { TaskDto } from '^/usecase/task/taskDto';
import type { FormValues } from '^/usecase/task/taskDto';
import type { UseFormReset } from 'react-hook-form/dist/types/form';
import { useState, useCallback, useMemo } from 'react';

export const useTaskFormDialog = (reset: UseFormReset<FormValues>, tasks?: TaskDto[]) => {
  const [isOpenTaskFormDialog, setIsOpenTaskFormDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto>();

  const handleOpenAddTaskFormDialog = useCallback(() => {
    setSelectedTask(undefined);
    reset({});
    setIsOpenTaskFormDialog(true);
  }, [reset]);
  const handleCloseTaskFormDialog = useCallback(() => {
    setIsOpenTaskFormDialog(false);
  }, []);
  const updateTaskHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...(tasks ?? []).map(task => ({
    [task.id]: () => {
      setSelectedTask(task);
      reset(task);
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

export const useDeleteTaskDialog = (tasks?: TaskDto[]) => {
  const [isOpenDeleteTaskDialog, setIsOpenDeleteTaskDialog] = useState(false);
  const [deleteTargetTask, setDeleteTargetTask] = useState<TaskDto>();
  const handleCloseDeleteTaskDialog = useCallback(() => {
    setIsOpenDeleteTaskDialog(false);
  }, []);
  const deleteTaskHandlers: Record<string, () => void> = useMemo(() => Object.assign({}, ...(tasks ?? []).map(task => ({
    [task.id]: () => {
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
