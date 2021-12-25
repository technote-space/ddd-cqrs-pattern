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
        'タスク名': 'テスト2',
        'メモ': 'メモ2',
        'ステータス': '実行中',
        '期日': '2022-01-20T01:00:00.000Z',
        '作業見積値': 10,
        '作業見積単位': '日',
        'タグ': ['あああ', 'いいい'],
      },
      {
        'id': 'id1',
        'タスク名': 'テスト1',
        'メモ': null,
        'ステータス': '登録',
        '期日': null,
        '作業見積値': null,
        '作業見積単位': null,
        'タグ': [],
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
    expect(result.current.tasks).toEqual([
      {
        'id': 'id2',
        'タスク名': 'テスト2',
        'メモ': 'メモ2',
        'ステータス': '実行中',
        '期日': '2022-01-20T01:00:00.000Z',
        '作業見積値': 10,
        '作業見積単位': '日',
        'タグ': ['あああ', 'いいい'],
      },
      {
        'id': 'id1',
        'タスク名': 'テスト1',
        'メモ': null,
        'ステータス': '登録',
        '期日': null,
        '作業見積値': null,
        '作業見積単位': null,
        'タグ': [],
      },
    ]);
    expect(mockUseUser).toBeCalled();
    expect(mockAdd).toBeCalledWith('loadingTasks', 'タスク読み込み中...');
    expect(mockDelete).toBeCalledWith('loadingTasks');
    expect(mockWithLoading).not.toBeCalled();
  });
});
