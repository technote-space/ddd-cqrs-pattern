import type { IBadgeProps } from '#/data/badge';
import type DueDate from '$/server/task/valueObject/dueDate';
import type Estimate from '$/server/task/valueObject/estimate';
import type { VFC } from 'react';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import Badge from '#/data/badge';
import Status from '$/server/task/valueObject/status';
import { getStartDate } from '@/web/pages/index/helpers/dueDate';

type Props = {
  status: Status;
  dueDate: DueDate | null;
  estimate: Estimate | null;
  current?: dayjs.ConfigType;
};

const getColorScheme = (status: Props['status'], dueDate: Props['dueDate'], estimate: Props['estimate'], current: Props['current']): string | undefined => {
  if (status.isDeleted()) return 'coolGray';
  if (status.equals(Status.create('完了'))) return 'info';

  if (dueDate && dueDate.value.isBefore(dayjs(current))) {
    return 'danger';
  }

  if (status.equals(Status.create('実行中'))) {
    return 'success';
  }

  const startDate = getStartDate(dueDate, estimate);
  if (startDate && startDate.isBefore(dayjs(current))) {
    return 'warning';
  }

  return 'success';
};

const StatusBadge: VFC<IBadgeProps & Props> = ({ status, dueDate, estimate, current, ...props }) => {
  const colorScheme = useMemo(() => getColorScheme(status, dueDate, estimate, current), [status, dueDate, estimate, current]);
  return <Badge colorScheme={colorScheme} {...props}>{status.displayValue}</Badge>;
};

StatusBadge.displayName = 'StatusBadge';
export default memo(StatusBadge);
