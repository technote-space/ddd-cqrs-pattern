import type { TaskDto } from '^/usecase/task/taskDto';
import type { VFC } from 'react';
import dayjs from 'dayjs';
import { memo } from 'react';
import DueDate from '@/web/pages/index/components/dueDate';
import StatusBadge from '@/web/pages/index/components/statusBadge';
import TagBadge from '@/web/pages/index/components/tagBadge';
import DeleteButton from '#/button/deleteButton';
import ButtonGroup from '#/button/group';
import UpdateButton from '#/button/updateButton';
import Flex from '#/layout/flex';
import HStack from '#/layout/hStack';
import Heading from '#/text/heading';
import LongText from '#/text/longText';

type Props = {
  task: TaskDto;
  onUpdate: () => void;
  onDelete: () => void;
  current?: dayjs.ConfigType;
};
const Task: VFC<Props> = ({
  task,
  onUpdate,
  onDelete,
  current,
}) => {
  return <Flex
    key={task.id}
    borderColor="#ccc"
    borderStyle="solid"
    borderWidth={1}
    m={3}
    p={3}
    maxW={600}
    width="100%"
  >
    <Flex flexDirection="row" alignItems="center">
      <Heading>{task.taskName}</Heading>
      <StatusBadge ml={2} status={task.status} dueDate={task.dueDate} estimateValue={task.estimateValue} estimateUnit={task.estimateUnit}/>
      <ButtonGroup alignSelf="right">
        <UpdateButton ml={4} size="sm" onPress={onUpdate}/>
        <DeleteButton ml={1} size="sm" onPress={onDelete}/>
      </ButtonGroup>
    </Flex>
    <Flex flexDirection="row">
      <Flex flex={1}>
        {task.memo && <LongText>{task.memo}</LongText>}
        {!!task.tags?.length && <HStack flexWrap="wrap">
          {task.tags.map((tag, index) => <TagBadge key={index} tag={tag}/>)}
        </HStack>}
      </Flex>
      <DueDate
        status={task.status}
        dueDate={task.dueDate}
        estimateValue={task.estimateValue}
        estimateUnit={task.estimateUnit}
        current={current}
      />
    </Flex>
  </Flex>;
};

Task.displayName = 'Task';
export default memo(Task);
