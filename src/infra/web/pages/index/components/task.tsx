import type TaskEntity from '$/server/task/task';
import type { VFC } from 'react';
import dayjs from 'dayjs';
import { memo } from 'react';
import DeleteButton from '#/button/deleteButton';
import ButtonGroup from '#/button/group';
import RestoreButton from '#/button/restoreButton';
import UpdateButton from '#/button/updateButton';
import Flex from '#/layout/flex';
import HStack from '#/layout/hStack';
import Heading from '#/text/heading';
import LongText from '#/text/longText';
import DueDate from '@/web/pages/index/components/dueDate';
import StatusBadge from '@/web/pages/index/components/statusBadge';
import TagBadge from '@/web/pages/index/components/tagBadge';

type Props = {
  task: TaskEntity;
  onUpdate: () => void;
  onRestore?: () => void;
  onDelete: () => void;
  current?: dayjs.ConfigType;
};
const Task: VFC<Props> = ({
  task,
  onUpdate,
  onRestore,
  onDelete,
  current,
}) => {
  return <Flex
    key={task.taskId.value}
    borderColor="#ccc"
    borderStyle="solid"
    borderWidth={1}
    m={3}
    p={3}
    maxW={600}
    width="100%"
  >
    <Flex flexDirection="row" alignItems="center">
      <Heading>{task.taskName.value}</Heading>
      <StatusBadge
        ml={2}
        status={task.status}
        dueDate={task.dueDate}
        estimate={task.estimate}
      />
      <ButtonGroup ml="auto" mb={2}>
        <RestoreButton ml={1} size="sm" onPress={onRestore}/>
        <UpdateButton ml={1} size="sm" onPress={onUpdate}/>
        <DeleteButton ml={1} size="sm" onPress={onDelete}/>
      </ButtonGroup>
    </Flex>
    <Flex flexDirection="row">
      <Flex flex={1}>
        {task.memo && <LongText>{task.memo.value}</LongText>}
        {!task.tags.isEmpty() && <HStack flexWrap="wrap">
          {task.tags.collections.map((tag, index) => <TagBadge key={index} tag={tag}/>)}
        </HStack>}
      </Flex>
      <DueDate
        status={task.status}
        dueDate={task.dueDate}
        estimate={task.estimate}
        current={current}
      />
    </Flex>
  </Flex>;
};

Task.displayName = 'Task';
export default memo(Task);
