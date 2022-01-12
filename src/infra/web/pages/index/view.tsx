import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';
import AddButton from '#/button/addButton';
import ButtonGroup from '#/button/group';
import Flex from '#/layout/flex';
import Tabs, { TabItem } from '#/layout/tab';
import Loading from '#/loading';

const Task = dynamic(() => import('./components/task'));
const TaskFormModal = dynamic(() => import('./components/taskFormModal'));
const RestoreAlertDialog = dynamic(() => import('./components/restoreAlertDialog'));
const DeleteAlertDialog = dynamic(() => import('./components/deleteAlertDialog'));

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
        {[
          <TabItem key="all" title="All">
            {useMemo(() => tasks?.map(task => <Task
              key={task.taskId.value}
              task={task}
              onUpdate={updateTaskHandlers[task.taskId.value]}
              onRestore={restoreTaskHandlers[task.taskId.value]}
              onDelete={deleteTaskHandlers[task.taskId.value]}
            />), [tasks, updateTaskHandlers, restoreTaskHandlers, deleteTaskHandlers])}
          </TabItem>,
          ...statuses.map(status =>
            <TabItem key={status} title={status}>
              {useMemo(() => tasks?.filter(task => task.status.isEqualLabelStatus(status)).map(task => <Task
                key={task.taskId.value}
                task={task}
                onUpdate={updateTaskHandlers[task.taskId.value]}
                onRestore={restoreTaskHandlers[task.taskId.value]}
                onDelete={deleteTaskHandlers[task.taskId.value]}
              />), [status])}
            </TabItem>,
          ),
        ]}
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
