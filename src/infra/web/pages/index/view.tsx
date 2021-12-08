import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo } from 'react';

const View: VFC<HooksParams> = ({ user, handleLogout, tasks }) => {
  if (!user.isLoggedIn) {
    return <div>Loading...</div>;
  }

  return <div>
    <div>Hello World!</div>
    <button role="logout" onClick={handleLogout}>Logout!</button>
    {tasks?.map(task => <div key={task.id}>
      <div>タスク名: {task.タスク名}</div>
      <div>メモ: {task.メモ}</div>
      <div>ステータス: {task.ステータス}</div>
      <div>期日: {task.期日}</div>
      <div>作業見積: {task.作業見積}</div>
      <div>作業見積単位: {task.作業見積単位}</div>
      <div>タグ: {task.タグ.join(', ')}</div>
    </div>)}
  </div>;
};

View.displayName = 'IndexView';
export default memo(View);
