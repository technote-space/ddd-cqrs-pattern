import type { VFC } from 'react';
import { Text, View, Button } from 'native-base';
import { memo, useCallback } from 'react';
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
    borderColor="#ccc"
    borderStyle="solid"
    borderWidth={1}
    m={3}
    p={3}
  >
    <Text>タスク名: {task.タスク名}</Text>
    <Text>メモ: {task.メモ}</Text>
    <Text>ステータス: {task.ステータス}</Text>
    <Text>期日: {task.期日}</Text>
    <Text>作業見積: {task.作業見積}</Text>
    <Text>作業見積単位: {task.作業見積単位}</Text>
    <Text>タグ: {task.タグ.join(', ')}</Text>
    <Button.Group>
      <Button onPress={_onUpdate}>Update</Button>
      <Button onPress={_onDelete} colorScheme="red">Delete</Button>
    </Button.Group>
  </View>;
};

Task.displayName = 'Task';
export default memo(Task);
