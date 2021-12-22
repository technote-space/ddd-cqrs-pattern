import type { TaskDto } from '^/usecase/task/taskDto';
import type { FormValues } from '^/usecase/task/taskDto';
import type { UseFormReset } from 'react-hook-form/dist/types/form';
import { useState, useCallback } from 'react';

export const useTaskFormDialog = (reset: UseFormReset<FormValues>) => {
  const [isOpenTaskFormDialog, setIsOpenTaskFormDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto>();
  const handleOpenUpdateTaskFormDialog = useCallback((task?: TaskDto) => {
    setSelectedTask(task);
    reset(task);
    setIsOpenTaskFormDialog(true);
  }, [reset]);
  const handleOpenAddTaskFormDialog = useCallback(() => {
    setSelectedTask(undefined);
    reset({});
    setIsOpenTaskFormDialog(true);
  }, [reset]);
  const handleCloseTaskFormDialog = useCallback(() => {
    setIsOpenTaskFormDialog(false);
  }, []);

  return {
    isOpenTaskFormDialog,
    selectedTask,
    handleOpenUpdateTaskFormDialog,
    handleOpenAddTaskFormDialog,
    handleCloseTaskFormDialog,
  };
};

export const useDeleteTaskDialog = () => {
  const [isOpenDeleteTaskDialog, setIsOpenDeleteTaskDialog] = useState(false);
  const [deleteTargetTask, setDeleteTargetTask] = useState<TaskDto>();
  const handleOpenDeleteTaskDialog = useCallback((task?: TaskDto) => {
    setDeleteTargetTask(task);
    setIsOpenDeleteTaskDialog(true);
  }, []);
  const handleCloseDeleteTaskDialog = useCallback(() => {
    setIsOpenDeleteTaskDialog(false);
  }, []);

  return {
    isOpenDeleteTaskDialog,
    deleteTargetTask,
    handleOpenDeleteTaskDialog,
    handleCloseDeleteTaskDialog,
  };
};
