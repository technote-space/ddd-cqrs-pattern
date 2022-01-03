import type DueDate from '$/shared/task/valueObject/dueDate';
import type Estimate from '$/shared/task/valueObject/estimate';
import EstimateUnit from '$/shared/task/valueObject/estimateUnit';

export const getStartDate = (dueDate: DueDate | null, estimate?: Estimate | null) => {
  if (!dueDate || !estimate) {
    return null;
  }

  return dueDate.value.subtract(estimate.value.value.value, estimate.value.unit.equals(EstimateUnit.create('日')) ? 'day' : 'hour');
};
