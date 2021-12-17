import type { VFC } from 'react';
import { memo, useCallback } from 'react';
import Text from '@/web/components/text';
import View from '@/web/components/view';
import { TaskDto } from '^/usecase/task/taskDto';

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
  return <View
    key={task.id}
    style={{
      borderStyle: 'solid',
      borderColor: '#ccc',
      borderWidth: 1,
      margin: 10,
      padding: 10,
    }}
  >
    <Text>タスク名: {task.タスク名}</Text>
    <Text>メモ: {task.メモ}</Text>
    <Text>ステータス: {task.ステータス}</Text>
    <Text>期日: {task.期日}</Text>
    <Text>作業見積: {task.作業見積}</Text>
    <Text>作業見積単位: {task.作業見積単位}</Text>
    <Text>タグ: {task.タグ.join(', ')}</Text>
    <button role="update" onClick={_onUpdate}>Update</button>
    <button role="delete" onClick={_onDelete}>Delete</button>
  </View>;
};

Task.displayName = 'Task';
export default memo(Task);
