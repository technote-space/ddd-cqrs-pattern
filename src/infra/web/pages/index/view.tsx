import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import AddButton from '@/web/components/button/addButton';
import ButtonGroup from '@/web/components/button/group';
import LogoutButton from '@/web/components/button/logoutButton';
import Loading from '@/web/components/loading';

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
    <ButtonGroup>
      <LogoutButton onPress={onLogout}/>
      <AddButton onPress={onAdd}/>
    </ButtonGroup>
    {isValidating && <Loading/>}
    {tasks?.map(task => <Task
      key={task.id}
      task={task}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />)}
  </>;
};

View.displayName = 'IndexView';
export default memo(View);
