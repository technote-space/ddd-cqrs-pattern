import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';
import AddButton from '#/button/addButton';
import ButtonGroup from '#/button/group';
import Flex from '#/layout/flex';
import Loading from '#/loading';

const Task = dynamic(() => import('./components/task'));
const TaskFormModal = dynamic(() => import('./components/taskFormModal'));
const DeleteAlertDialog = dynamic(() => import('./components/deleteAlertDialog'));

const View: VFC<HooksParams> = ({
  user,

  tasks,
  isValidatingTasks,
  updateTaskHandlers,
  deleteTaskHandlers,

  isOpenTaskFormDialog,
  handleOpenAddTaskFormDialog,
  handleCloseTaskFormDialog,
  selectedTask,
  validationErrors,
  onSubmitForm,
  control,
  isDisabled,
  formFields,

  isOpenDeleteTaskDialog,
  handleCloseDeleteTaskDialog,
  deleteTargetTask,
  onDelete,
}) => {
  if (!user.isLoggedIn) {
    return null;
  }

  return <>
    <Flex alignItems="center">
      <ButtonGroup>
        <AddButton onPress={handleOpenAddTaskFormDialog}/>
      </ButtonGroup>
      {isValidatingTasks && <Loading position="fixed" top={4}/>}
      {useMemo(() => tasks?.map(task => <Task
        key={task.id}
        task={task}
        onUpdate={updateTaskHandlers[task.id]}
        onDelete={deleteTaskHandlers[task.id]}
      />), [tasks, updateTaskHandlers, deleteTaskHandlers])}
    </Flex>
    <TaskFormModal
      isOpenTaskFormDialog={isOpenTaskFormDialog}
      handleCloseTaskFormDialog={handleCloseTaskFormDialog}
      selectedTask={selectedTask}
      validationErrors={validationErrors}
      onSubmitForm={onSubmitForm}
      control={control}
      isDisabled={isDisabled}
      formFields={formFields}
    />
    <DeleteAlertDialog
      isOpenDeleteTaskDialog={isOpenDeleteTaskDialog}
      handleCloseDeleteTaskDialog={handleCloseDeleteTaskDialog}
      deleteTargetTask={deleteTargetTask}
      onDelete={onDelete}
    />
  </>;
};

View.displayName = 'IndexView';
export default memo(View);
