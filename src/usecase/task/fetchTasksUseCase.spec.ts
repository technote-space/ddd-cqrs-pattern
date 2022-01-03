import Tag from '$/shared/tag/tag';
import Tags from '$/shared/tag/tags';
import TagId from '$/shared/tag/valueObject/tagId';
import TagName from '$/shared/tag/valueObject/tagName';
import Task from '$/shared/task/task';
import DueDate from '$/shared/task/valueObject/dueDate';
import Estimate from '$/shared/task/valueObject/estimate';
import EstimateUnit from '$/shared/task/valueObject/estimateUnit';
import EstimateValue from '$/shared/task/valueObject/estimateValue';
import Memo from '$/shared/task/valueObject/memo';
import Status from '$/shared/task/valueObject/status';
import TaskId from '$/shared/task/valueObject/taskId';
import TaskName from '$/shared/task/valueObject/taskName';
import UserId from '$/shared/user/valueObject/userId';
import FetchTasksUseCase from './fetchTasksUseCase';

describe('FetchTasksUseCase', () => {
  it('ユーザーのタスク一覧を取得する', async () => {
    const userId = UserId.create('userId');
    const mockFindByUser = jest.fn(() => Promise.resolve([
      Task.reconstruct(
        TaskId.create('test1'), TaskName.create('name1'), Memo.create('memo1'), Status.create('登録'), DueDate.create('2022-01-01'),
        Estimate.create({
          value: EstimateValue.create(10),
          unit: EstimateUnit.create('日'),
        }),
        userId, Tags.create([Tag.reconstruct(TagId.create('tag1'), TagName.create('tag1')), Tag.reconstruct(TagId.create('tag2'), TagName.create('tag2'))]),
      ),
      Task.reconstruct(
        TaskId.create('test2'), TaskName.create('name2'), null, Status.create('実行中'), null, null,
        userId, Tags.create([]),
      ),
    ]));
    const useCase = new FetchTasksUseCase({ findByUser: mockFindByUser });

    const tasks = await useCase.invoke({ userId: UserId.create('test') });
    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe('test1');
    expect(tasks[0].taskName).toBe('name1');
    expect(tasks[0].memo).toBe('memo1');
    expect(tasks[0].status).toBe('登録');
    expect(tasks[0].dueDate).toBe('2021-12-31T15:00:00.000Z');
    expect(tasks[0].estimateValue).toBe(10);
    expect(tasks[0].estimateUnit).toBe('日');
    expect(tasks[0].tags).toHaveLength(2);
    expect(tasks[0].tags![0]).toBe('tag1'); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    expect(tasks[0].tags![1]).toBe('tag2'); // eslint-disable-line @typescript-eslint/no-non-null-assertion

    expect(tasks[1].id).toBe('test2');
    expect(tasks[1].taskName).toBe('name2');
    expect(tasks[1].memo).toBeNull();
    expect(tasks[1].status).toBe('実行中');
    expect(tasks[1].dueDate).toBeNull();
    expect(tasks[1].estimateValue).toBeNull();
    expect(tasks[1].estimateUnit).toBeNull();
    expect(tasks[1].tags).toHaveLength(0);
  });
});
