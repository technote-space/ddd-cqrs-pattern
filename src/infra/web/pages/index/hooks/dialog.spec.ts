import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskFormDialog, useDeleteTaskDialog } from './dialog';

describe('useTaskFormDialog', () => {
  it('追加ダイアログ', () => {
    const mockRest = jest.fn();
    const { result } = renderHook(() => useTaskFormDialog(mockRest, []));

    expect(result.current.isOpenTaskFormDialog).toBe(false);
    expect(result.current.selectedTask).toBeUndefined();

    act(() => result.current.handleOpenAddTaskFormDialog());
    expect(result.current.isOpenTaskFormDialog).toBe(true);
    expect(mockRest).toBeCalledWith({});

    act(() => result.current.handleCloseTaskFormDialog());
    expect(result.current.isOpenTaskFormDialog).toBe(false);
  });

  it('更新ダイアログ', () => {
    const mockRest = jest.fn();
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
    const { result } = renderHook(() => useTaskFormDialog(mockRest, [task]));

    expect(result.current.isOpenTaskFormDialog).toBe(false);
    expect(result.current.selectedTask).toBeUndefined();
    expect(result.current.updateTaskHandlers).toHaveProperty('id');

    act(() => result.current.updateTaskHandlers['id']());
    expect(result.current.isOpenTaskFormDialog).toBe(true);
    expect(result.current.selectedTask).toEqual(task);
    expect(mockRest).toBeCalledWith(task);

    act(() => result.current.handleCloseTaskFormDialog());
    expect(result.current.isOpenTaskFormDialog).toBe(false);
  });
});

describe('useDeleteTaskDialog', () => {
  it('削除ダイアログ', () => {
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
    const { result } = renderHook(() => useDeleteTaskDialog([task]));

    expect(result.current.isOpenDeleteTaskDialog).toBe(false);
    expect(result.current.deleteTargetTask).toBeUndefined();
    expect(result.current.deleteTaskHandlers).toHaveProperty('id');

    act(() => result.current.deleteTaskHandlers['id']());

    expect(result.current.isOpenDeleteTaskDialog).toBe(true);
    expect(result.current.deleteTargetTask).toEqual(task);

    act(() => result.current.handleCloseDeleteTaskDialog());
    expect(result.current.isOpenDeleteTaskDialog).toBe(false);
  });
});
