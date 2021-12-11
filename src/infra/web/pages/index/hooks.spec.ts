import { renderHook } from '@testing-library/react-hooks';
import { client } from '@/web/shared/api';
import { createLocalHandler, useMockServer } from '^/__mocks__/server';
import { useHooks } from './hooks';

describe('useHooks', () => {
  useMockServer([
    createLocalHandler('get', '/tasks/', 200, [
      {
        'id': 'id2',
        'タスク名': 'テスト2',
        'メモ': 'メモ2',
        'ステータス': '実行中',
        '期日': '2022-01-20T01:00:00.000Z',
        '作業見積': 10,
        '作業見積単位': '日',
        'タグ': ['あああ', 'いいい'],
      },
      {
        'id': 'id1',
        'タスク名': 'テスト1',
        'メモ': null,
        'ステータス': '登録',
        '期日': null,
        '作業見積': null,
        '作業見積単位': null,
        'タグ': [],
      },
    ]),
  ]);

  it('ログイン済みの場合にタスク一覧を取得', async () => {
    const mockUseUser = jest.fn(() => ({ isLoggedIn: true, user: { authorization: 'token' } }));
    const mockUseLogout = jest.fn();
    const { result, waitFor } = renderHook(() => useHooks({}, {
      useUser: mockUseUser,
      useLogout: mockUseLogout,
    }, client));

    await waitFor(() => expect(result.current.tasks).not.toBeUndefined());
    expect(result.current.tasks).toEqual([
      {
        'id': 'id2',
        'タスク名': 'テスト2',
        'メモ': 'メモ2',
        'ステータス': '実行中',
        '期日': '2022-01-20T01:00:00.000Z',
        '作業見積': 10,
        '作業見積単位': '日',
        'タグ': ['あああ', 'いいい'],
      },
      {
        'id': 'id1',
        'タスク名': 'テスト1',
        'メモ': null,
        'ステータス': '登録',
        '期日': null,
        '作業見積': null,
        '作業見積単位': null,
        'タグ': [],
      },
    ]);
    expect(mockUseUser).toBeCalled();
    expect(mockUseLogout).toBeCalled();
  });
});
