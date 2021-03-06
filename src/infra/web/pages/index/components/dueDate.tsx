import type { IBadgeProps } from '#/data/badge';
import type DueDateValueObject from '$/shared/task/valueObject/dueDate';
import type Estimate from '$/shared/task/valueObject/estimate';
import type { VFC } from 'react';
import dayjs from 'dayjs';
import { memo } from 'react';
import Badge from '#/data/badge';
import Text from '#/text/text';
import Status from '$/shared/task/valueObject/status';
import { getStartDate } from '@/web/pages/index/helpers/dueDate';

type Props = {
  status: Status;
  dueDate: DueDateValueObject | null;
  estimate: Estimate | null;
  current?: dayjs.ConfigType;
};

export const getDiffString = (diff: number): string => {
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day > 0) return `${day}日`;
  if (hour > 0) return `${hour}時間`;
  if (min > 0) return `${min}分`;
  return `${sec}秒`;
};

const DueDate: VFC<IBadgeProps & Props> = ({ status, dueDate, estimate, current, ...props }) => {
  if (!dueDate) {
    return null;
  }

  if (status.isDeleted() || status.equals(Status.create('完了'))) {
    return <Badge borderRadius={10} p={3} justifyContent="center" alignSelf="center" colorScheme="coolGray" {...props}>
      <Text bold>{dueDate.value.format('YYYY/MM/DD HH:mm')}</Text>
    </Badge>;
  }

  if (estimate) {
    const startDate = getStartDate(dueDate, estimate);
    if (startDate && startDate.isAfter(dayjs(current))) {
      return <Badge borderRadius={10} p={3} justifyContent="center" alignSelf="center" colorScheme="info" {...props}>
        <Text bold>開始予定：<Text fontSize="1.5em">{getDiffString(startDate.diff(current))}</Text>後</Text>
        <Text mt={1}>{dueDate.value.format('YYYY/MM/DD HH:mm')}</Text>
      </Badge>;
    }
  }

  if (dueDate.value.isAfter(dayjs(current))) {
    return <Badge borderRadius={10} p={3} justifyContent="center" alignSelf="center" colorScheme="success" {...props}>
      <Text bold>残り期限：<Text fontSize="1.5em">{getDiffString(dueDate.value.diff(current))}</Text></Text>
      <Text mt={1}>{dueDate.value.format('YYYY/MM/DD HH:mm')}</Text>
    </Badge>;
  }

  return <Badge borderRadius={10} p={3} justifyContent="center" alignSelf="center" colorScheme="danger" {...props}>
    <Text bold>期限から<Text fontSize="1.5em">{getDiffString(-dueDate.value.diff(current))}</Text>経過</Text>
    <Text mt={1}>{dueDate.value.format('YYYY/MM/DD HH:mm')}</Text>
  </Badge>;
};

DueDate.displayName = 'DueDate';
export default memo(DueDate);
