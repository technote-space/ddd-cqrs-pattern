import type { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs from 'dayjs';
import DueDateValueObject from '$/server/task/valueObject/dueDate';
import Estimate from '$/server/task/valueObject/estimate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Status from '$/server/task/valueObject/status';
import DueDate from './dueDate';

export default {
  title: 'Domain Components/Index/DueDate',
  component: DueDate,
  argTypes: {
    status: { control: { type: 'inline-radio' }, options: ['登録', '実行中', '完了', '削除(登録)', '削除(実行中)', '削除(完了)'] },
    dueDate: { control: { type: 'date' } },
    estimateValue: { control: { type: 'number' } },
    estimateUnit: { control: { type: 'inline-radio' }, options: ['日', '時間'] },
  },
} as ComponentMeta<typeof DueDate>;

const current = dayjs('2000-01-23');
const Template: ComponentStory<typeof DueDate> = (args) => <DueDate current={current} {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: Status.create('登録'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(-15, 'day')),
  estimate: Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('日') }),
};

export const NoDueDate = Template.bind({});
NoDueDate.args = {
  status: Status.create('登録'),
};

export const Finished = Template.bind({});
Finished.args = {
  status: Status.create('完了'),
  dueDate: DueDateValueObject.create(current),
};

export const Expired = Template.bind({});
Expired.args = {
  status: Status.create('登録'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(5, 'hour')),
  estimate: Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('時間') }),
};

export const Deleted = Template.bind({});
Deleted.args = {
  status: Status.create('削除(登録)'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(-15, 'day')),
};

export const InProgress = Template.bind({});
InProgress.args = {
  status: Status.create('実行中'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(-5, 'day')),
  estimate: Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('日') }),
};

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: Status.create('登録'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(-15, 'day')),
  estimate: Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('日') }),
};

export const NoEstimate = Template.bind({});
NoEstimate.args = {
  status: Status.create('実行中'),
  dueDate: DueDateValueObject.create(dayjs(current).subtract(-5, 'day')),
};
