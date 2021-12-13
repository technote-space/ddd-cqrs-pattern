import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const Task = dynamic(() => import('./components/task'));

const View: VFC<HooksParams> = ({
  user,
  tasks,
  isValidating,
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
    {isValidating && <div>Loading tasks...</div>}
    {!isValidating && tasks?.map(task => <Task
      key={task.id}
      task={task}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />)}
  </div>;
};

View.displayName = 'IndexView';
export default memo(View);
