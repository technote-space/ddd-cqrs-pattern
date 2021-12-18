import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import AddButton from '@/web/components/addButton';
import Loading from '@/web/components/loading';
import LogoutButton from '@/web/components/logoutButton';

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
    return null;
  }

  return <>
    <LogoutButton onPress={onLogout}/>
    <AddButton onPress={onAdd}/>
    {isValidating && <Loading/>}
    {!isValidating && tasks?.map(task => <Task
      key={task.id}
      task={task}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />)}
  </>;
};

View.displayName = 'IndexView';
export default memo(View);
