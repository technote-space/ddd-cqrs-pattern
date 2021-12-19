import dayjs from 'dayjs';

export const getStartDate = (dueDate: string | null, estimateValue: number | null, estimateUnit: string | null) => {
  if (!dueDate || !estimateValue || !estimateUnit) {
    return null;
  }

  if (estimateUnit !== '日' && estimateUnit !== '時間') {
    return null;
  }

  return dayjs(dueDate).subtract(estimateValue, estimateUnit === '日' ? 'day' : 'hour');
};
