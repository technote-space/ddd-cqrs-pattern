/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { renderHook } from '@testing-library/react-hooks';
import * as loadingHooks from '@/web/shared/loading';
import { TestApi } from '^/__mocks__/api';
import { createLocalHandler, useMockServer } from '^/__mocks__/server';
import { useHooks } from '.';

jest.mock('react-redux');

describe('useHooks', () => {
  useMockServer([
    createLocalHandler('get', '/tasks/', 200, [
      {
        'id': 'id2',
        'taskName': 'テスト2',
        'memo': 'メモ2',
        'status': '実行中',
        'dueDate': '2022-01-20T01:00:00.000Z',
        'estimateValue': 10,
        'estimateUnit': '日',
        'tags': ['あああ', 'いいい'],
      },
      {
        'id': 'id1',
        'taskName': 'テスト1',
        'memo': null,
        'status': '登録',
        'dueDate': null,
        'estimateValue': null,
        'estimateUnit': null,
        'tags': [],
      },
    ]),
  ]);

  it('ログイン済みの場合にタスク一覧を取得', async () => {
    const mockWithLoading = jest.fn(callback => callback());
    const mockAdd = jest.fn();
    const mockDelete = jest.fn();
    jest.spyOn(loadingHooks, 'useLoading').mockReturnValue(mockWithLoading);
    jest.spyOn(loadingHooks, 'useAddProcess').mockReturnValue(mockAdd);
    jest.spyOn(loadingHooks, 'useDeleteProcess').mockReturnValue(mockDelete);
    const mockUseUser = jest.fn(() => ({ isLoggedIn: true, user: { authorization: 'token' } }));
    const { result, waitFor } = renderHook(() => useHooks({}, { useUser: mockUseUser } as never, new TestApi()));

    await waitFor(() => expect(result.current.tasks).not.toBeUndefined());
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks![0].taskId.value).toBe('id2');
    expect(result.current.tasks![0].taskName.value).toBe('テスト2');
    expect(result.current.tasks![0].memo?.value).toBe('メモ2');
    expect(result.current.tasks![0].status.value).toBe('実行中');
    expect(result.current.tasks![0].dueDate?.value.toISOString()).toBe('2022-01-20T01:00:00.000Z');
    expect(result.current.tasks![0].estimate?.value.value.value).toBe(10);
    expect(result.current.tasks![0].estimate?.value.unit.value).toBe('日');
    expect(result.current.tasks![0].tags.collections).toHaveLength(2);
    expect(result.current.tasks![0].tags.collections[0].tagName.value).toBe('あああ');
    expect(result.current.tasks![0].tags.collections[1].tagName.value).toBe('いいい');
    expect(result.current.tasks![1].taskId.value).toBe('id1');
    expect(result.current.tasks![1].taskName.value).toBe('テスト1');
    expect(result.current.tasks![1].memo).toBeNull();
    expect(result.current.tasks![1].status.value).toBe('登録');
    expect(result.current.tasks![1].dueDate).toBeNull();
    expect(result.current.tasks![1].estimate).toBeNull();
    expect(result.current.tasks![1].tags.collections).toHaveLength(0);
    expect(mockUseUser).toBeCalled();
    expect(mockAdd).toBeCalledWith('loadingTasks', 'タスク読み込み中...');
    expect(mockDelete).toBeCalledWith('loadingTasks');
    expect(mockWithLoading).not.toBeCalled();
  });
});
