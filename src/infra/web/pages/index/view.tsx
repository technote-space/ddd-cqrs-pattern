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

const View: VFC<HooksParams> = ({
  user,
  tasks,
  isValidatingTasks,
  onLogout,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  if (!user.isLoggedIn) {
    return null;
  }

  return <Center>
    <ButtonGroup>
      <LogoutButton onPress={onLogout}/>
      <AddButton onPress={onAdd}/>
    </ButtonGroup>
    {isValidatingTasks && <Loading/>}
    {tasks?.map(task => <Task
      key={task.id}
      task={task}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />)}
  </Center>;
};

View.displayName = 'IndexView';
export default memo(View);
