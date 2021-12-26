import { renderHook, act } from '@testing-library/react-hooks';
import { useDeleteTask } from './form';

describe('useDeleteTask', () => {
  it('削除対象が選択されている場合に削除', () => {
    const task = {
      id: 'id',
      taskName: 'タスク名',
      memo: null,
      status: '登録',
      dueDate: null,
      estimateValue: null,
      estimateUnit: null,
      tags: [],
    };
    const mockUseUser = jest.fn(() => ({ isLoggedIn: false }));
    const mockCaller = jest.fn(() => Promise.resolve());
    const mockMutateTasks = jest.fn();
    const { result, waitFor } = renderHook(() => useDeleteTask({
      useUser: mockUseUser,
    } as never, {
      useCaller: () => mockCaller,
    } as never, task, mockMutateTasks));

    act(() => result.current.onDelete());

    expect(mockCaller).toBeCalledTimes(1);
    waitFor(() => expect(mockMutateTasks).toBeCalledTimes(1));
  });

  it('削除対象が選択されていない場合は削除されない', () => {
    const mockUseUser = jest.fn(() => ({ isLoggedIn: false }));
    const mockCaller = jest.fn();
    const mockMutateTasks = jest.fn();
    const { result } = renderHook(() => useDeleteTask({
      useUser: mockUseUser,
    } as never, {
      useCaller: () => mockCaller,
    } as never, undefined, mockMutateTasks));

    act(() => result.current.onDelete());

    expect(mockCaller).not.toBeCalled();
    expect(mockMutateTasks).not.toBeCalled();
  });
});
