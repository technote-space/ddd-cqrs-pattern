import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import AddButton from '@/web/pages/index/components/addButton';
import LogoutButton from '@/web/pages/index/components/logoutButton';
import Message from '@/web/pages/index/components/message';

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
    return <Message>Loading...</Message>;
  }

  return <div>
    <LogoutButton onPress={onLogout}/>
    <AddButton onPress={onAdd}/>
    {isValidating && <Message>Loading tasks...</Message>}
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
