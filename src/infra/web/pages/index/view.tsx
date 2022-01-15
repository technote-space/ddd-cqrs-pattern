import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo, useMemo } from 'react';
import AddButton from '#/button/addButton';
import ButtonGroup from '#/button/group';
import Flex from '#/layout/flex';
import Tabs, { TabItem } from '#/layout/tab';
import Loading from '#/loading';
import DeleteAlertDialog from './components/deleteAlertDialog';
import RestoreAlertDialog from './components/restoreAlertDialog';
import Task from './components/task';
import TaskFormModal from './components/taskFormModal';

const View: VFC<HooksParams> = ({
  user,

  tasks,
  statuses,
  isValidatingTasks,
  updateTaskHandlers,
  restoreTaskHandlers,
  deleteTaskHandlers,

  isOpenTaskFormDialog,
  handleOpenAddTaskFormDialog,
  handleCloseTaskFormDialog,
  selectedTask,
  validationErrors,
  onSubmitForm,
  control,
  isDisabled,
  isSubmitting,
  formFields,

  isOpenRestoreTaskDialog,
  handleCloseRestoreTaskDialog,
  restoreTargetTask,
  onRestore,

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
      <Tabs>
        {useMemo(() => ['ALL'].concat(statuses).map(status => {
          const filteredTasks = (tasks ?? []).filter(task => 'ALL' === status || task.status.isEqualLabelStatus(status));
          return <TabItem key={status} title={`${status}(${filteredTasks.length})`}>
            {filteredTasks.map(task =>
              <Task
                key={task.taskId.value}
                task={task}
                onUpdate={updateTaskHandlers[task.taskId.value]}
                onRestore={restoreTaskHandlers[task.taskId.value]}
                onDelete={deleteTaskHandlers[task.taskId.value]}
              />)}
          </TabItem>;
        }), [tasks, statuses, updateTaskHandlers, restoreTaskHandlers, deleteTaskHandlers])}
      </Tabs>
    </Flex>
    <TaskFormModal
      isOpenTaskFormDialog={isOpenTaskFormDialog}
      handleCloseTaskFormDialog={handleCloseTaskFormDialog}
      selectedTask={selectedTask}
      validationErrors={validationErrors}
      onSubmitForm={onSubmitForm}
      control={control}
      isDisabled={isDisabled}
      isSubmitting={isSubmitting}
      formFields={formFields}
    />
    <RestoreAlertDialog
      isOpenRestoreTaskDialog={isOpenRestoreTaskDialog}
      handleCloseRestoreTaskDialog={handleCloseRestoreTaskDialog}
      restoreTargetTask={restoreTargetTask}
      onRestore={onRestore}
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
