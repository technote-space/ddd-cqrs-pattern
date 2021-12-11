import type { HooksParams } from './hooks';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import { memo, useCallback } from 'react';

const Task: VFC<{ task: TaskDto; onUpdate: (id: string) => void; onDelete: (id: string) => void }> = ({
  task,
  onUpdate,
  onDelete,
}) => {
  const _onUpdate = useCallback(() => {
    onUpdate(task.id);
  }, [task.id, onUpdate]);
  const _onDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);
  return <div key={task.id} style={{ border: 'solid 1px #ccc', margin: '10px', padding: '10px' }}>
    <div>タスク名: {task.タスク名}</div>
    <div>メモ: {task.メモ}</div>
    <div>ステータス: {task.ステータス}</div>
    <div>期日: {task.期日}</div>
    <div>作業見積: {task.作業見積}</div>
    <div>作業見積単位: {task.作業見積単位}</div>
    <div>タグ: {task.タグ.join(', ')}</div>
    <button role="update" onClick={_onUpdate}>Update</button>
    <button role="delete" onClick={_onDelete}>Delete</button>
  </div>;
};

const View: VFC<HooksParams> = ({
  user,
  tasks,
  onLogout,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  if (!user.isLoggedIn) {
    return <div>Loading...</div>;
  }

  return <div>
    <div>Hello World!</div>
    <button role="logout" onClick={onLogout}>Logout!</button>
    <button role="add" onClick={onAdd}>Add!!!</button>
    {tasks?.map(task => <Task
      key={task.id}
      task={task}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />)}
  </div>;
};

View.displayName = 'IndexView';
export default memo(View);
