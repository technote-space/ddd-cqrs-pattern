import type { IBadgeProps } from '#/data/badge';
import type { VFC } from 'react';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { getStartDate } from '@/web/pages/index/helpers/dueDate';
import Badge from '#/data/badge';

type Props = {
  status: string;
  dueDate: string | null;
  estimateValue: number | null;
  estimateUnit: string | null;
};

const getColorScheme = (status: Props['status'], dueDate: Props['dueDate'], estimateValue: Props['estimateValue'], estimateUnit: Props['estimateUnit']): string | undefined => {
  if (status.startsWith('削除')) return 'coolGray';
  if (status === '完了') return 'info';

  if (dueDate && dayjs(dueDate).isBefore(dayjs())) {
    return 'danger';
  }

  if (status === '実行中') {
    return 'success';
  }

  const startDate = getStartDate(dueDate, estimateValue, estimateUnit);
  if (startDate && startDate.isBefore(dayjs())) {
    return 'warning';
  }

  return 'success';
};

const StatusBadge: VFC<IBadgeProps & Props> = ({ status, dueDate, estimateValue, estimateUnit, ...props }) => {
  const colorScheme = useMemo(() => getColorScheme(status, dueDate, estimateValue, estimateUnit), [status, dueDate, estimateValue, estimateUnit]);
  return <Badge colorScheme={colorScheme} {...props}>{status}</Badge>;
};

StatusBadge.displayName = 'StatusBadge';
export default memo(StatusBadge);
