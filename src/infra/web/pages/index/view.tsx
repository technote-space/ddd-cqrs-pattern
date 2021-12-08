import type { HooksParams } from './hooks';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import { memo, useCallback } from 'react';

const Task: VFC<{ task: TaskDto; handleUpdate: (id: string) => void; handleDelete: (id: string) => void }> = ({
  task,
  handleUpdate,
  handleDelete,
}) => {
  const _handleUpdate = useCallback(() => {
    handleUpdate(task.id);
  }, [task.id]);
  const _handleDelete = useCallback(() => {
    handleDelete(task.id);
  }, [task.id]);
  return <div key={task.id} style={{ border: 'solid 1px #ccc', margin: '10px', padding: '10px' }}>
    <div>タスク名: {task.タスク名}</div>
    <div>メモ: {task.メモ}</div>
    <div>ステータス: {task.ステータス}</div>
    <div>期日: {task.期日}</div>
    <div>作業見積: {task.作業見積}</div>
    <div>作業見積単位: {task.作業見積単位}</div>
    <div>タグ: {task.タグ.join(', ')}</div>
    <button role="update" onClick={_handleUpdate}>Update</button>
    <button role="delete" onClick={_handleDelete}>Delete</button>
  </div>;
};

const View: VFC<HooksParams> = ({
  user,
  tasks,
  handleLogout,
  handleAdd,
  handleUpdate,
  handleDelete,
}) => {
  if (!user.isLoggedIn) {
    return <div>Loading...</div>;
  }

  return <div>
    <div>Hello World!</div>
    <button role="logout" onClick={handleLogout}>Logout!</button>
    <button role="add" onClick={handleAdd}>Add!!!</button>
    {tasks?.map(task => <Task
      key={task.id}
      task={task}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
    />)}
  </div>;
};

View.displayName = 'IndexView';
export default memo(View);
