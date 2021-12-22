import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import AddButton from '#/button/addButton';
import ButtonGroup from '#/button/group';
import LogoutButton from '#/button/logoutButton';
import Center from '#/layout/center';
import Loading from '#/loading';

const Task = dynamic(() => import('./components/task'));
const TaskFormModal = dynamic(() => import('./components/taskFormModal'));
const DeleteAlertDialog = dynamic(() => import('./components/deleteAlertDialog'));

const View: VFC<HooksParams> = ({
  user,
  onLogout,

  tasks,
  isValidatingTasks,

  isOpenTaskFormDialog,
  handleOpenAddTaskFormDialog,
  handleOpenUpdateTaskFormDialog,
  handleCloseTaskFormDialog,
  selectedTask,
  validationErrors,
  onSubmitForm,
  control,
  isDisabled,

  isOpenDeleteTaskDialog,
  handleOpenDeleteTaskDialog,
  handleCloseDeleteTaskDialog,
  deleteTargetTask,
  onDelete,
}) => {
  if (!user.isLoggedIn) {
    return null;
  }

  console.log(tasks);
  return <>
    <Center>
      <ButtonGroup>
        <LogoutButton onPress={onLogout}/>
        <AddButton onPress={handleOpenAddTaskFormDialog}/>
      </ButtonGroup>
      {isValidatingTasks && <Loading/>}
      {tasks?.map(task => <Task
        key={task.id}
        task={task}
        onUpdate={handleOpenUpdateTaskFormDialog}
        onDelete={handleOpenDeleteTaskDialog}
      />)}
    </Center>
    <TaskFormModal
      isOpenTaskFormDialog={isOpenTaskFormDialog}
      handleCloseTaskFormDialog={handleCloseTaskFormDialog}
      selectedTask={selectedTask}
      validationErrors={validationErrors}
      onSubmitForm={onSubmitForm}
      control={control}
      isDisabled={isDisabled}
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
