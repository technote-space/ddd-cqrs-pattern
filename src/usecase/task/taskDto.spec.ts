import Tag from '$/server/tag/tag';
import Tags from '$/server/tag/tags';
import TagName from '$/server/tag/valueObject/tagName';
import Task from '$/server/task/task';
import DueDate from '$/server/task/valueObject/dueDate';
import Estimate from '$/server/task/valueObject/estimate';
import EstimateUnit from '$/server/task/valueObject/estimateUnit';
import EstimateValue from '$/server/task/valueObject/estimateValue';
import Memo from '$/server/task/valueObject/memo';
import Status from '$/server/task/valueObject/status';
import TaskId from '$/server/task/valueObject/taskId';
import TaskName from '$/server/task/valueObject/taskName';
import UserId from '$/server/user/valueObject/userId';
import { fromEntity, toEntity } from './taskDto';

describe('fromEntity', () => {
  it('entity to dto', () => {
    const dto = fromEntity(Task.reconstruct(
      TaskId.create('id'),
      TaskName.create('task'),
      Memo.create('memo'),
      Status.create('登録'),
      DueDate.create('2020-01-23T10:00:00+09:00'),
      Estimate.create({ value: EstimateValue.create(10), unit: EstimateUnit.create('日') }),
      UserId.create('user'),
      Tags.create([Tag.create(TagName.create('tag'))]),
    ));

    expect(dto.id).toBe('id');
    expect(dto.taskName).toBe('task');
    expect(dto.memo).toBe('memo');
    expect(dto.status).toBe('登録');
    expect(dto.dueDate).toBe('2020-01-23T01:00:00.000Z');
    expect(dto.estimateValue).toBe(10);
    expect(dto.estimateUnit).toBe('日');
    expect(dto.tags).toEqual(['tag']);
  });

  it('entity to dto', () => {
    const dto = fromEntity(Task.reconstruct(
      TaskId.create('id'),
      TaskName.create('task'),
      null,
      Status.create('登録'),
      null,
      null,
      UserId.create('user'),
      Tags.create([]),
    ));

    expect(dto.id).toBe('id');
    expect(dto.taskName).toBe('task');
    expect(dto.memo).toBeNull();
    expect(dto.status).toBe('登録');
    expect(dto.dueDate).toBeNull();
    expect(dto.estimateValue).toBeNull();
    expect(dto.estimateUnit).toBeNull();
    expect(dto.tags).toEqual([]);
  });
});

describe('toEntity', () => {
  it('dto to entity', () => {
    const entity = toEntity(UserId.create('user'), {
      taskName: 'task',
      memo: 'memo',
      status: '登録',
      dueDate: '2020-01-23T10:00:00+09:00',
      estimateValue: 10,
      estimateUnit: '日',
      tags: ['tag'],
    });

    expect(entity.taskName.value).toBe('task');
    expect(entity.memo?.value).toBe('memo');
    expect(entity.status.value).toBe('登録');
    expect(entity.dueDate?.value.toISOString()).toBe('2020-01-23T01:00:00.000Z');
    expect(entity.estimate?.value.value.value).toBe(10);
    expect(entity.estimate?.value.unit.value).toBe('日');
    expect(entity.tags.collections.map(tag => tag.tagName.value)).toEqual(['tag']);
  });

  it('dto to entity', () => {
    const entity = toEntity(UserId.create('user'), {
      taskName: 'task',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
    });

    expect(entity.taskName.value).toBe('task');
    expect(entity.memo).toBeNull();
    expect(entity.status.value).toBe('登録');
    expect(entity.dueDate).toBeNull();
    expect(entity.estimate).toBeNull();
    expect(entity.tags.collections.map(tag => tag.tagName.value)).toEqual([]);
  });
});
