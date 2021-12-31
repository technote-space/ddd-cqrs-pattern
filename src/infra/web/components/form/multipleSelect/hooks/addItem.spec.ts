import { renderHook, act } from '@testing-library/react-hooks';
import { useAddItem } from './addItem';

describe('useAddItem', () => {
  it('新規追加の動作確認', () => {
    const mockHandleAddItem = jest.fn(() => true);
    const { result } = renderHook(() => useAddItem({ handleAddItem: mockHandleAddItem }));

    expect(result.current.addItemValue).toBe('');
    expect(result.current.isOpenAddModal).toBe(false);

    // 新規追加ダイアログを開く
    act(() => result.current.handleOpenAddItem());
    expect(result.current.isOpenAddModal).toBe(true);

    // 文字の入力
    act(() => result.current.handleChangeAddItemValue('test'));
    expect(result.current.addItemValue).toBe('test');

    // 新規追加ダイアログを閉じる
    act(() => result.current.handleCloseAddItem());
    expect(result.current.isOpenAddModal).toBe(false);

    // 再度、新規追加ダイアログを開き、文字を入力
    act(() => result.current.handleOpenAddItem());
    act(() => result.current.handleChangeAddItemValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addItemValue).toBe('test');

    // 送信
    act(() => result.current.handleSubmitAddItem());
    expect(mockHandleAddItem).toBeCalledWith('test');
    expect(result.current.isOpenAddModal).toBe(false);
  });

  it('重複タグを追加時にモーダルが閉じないことを確認', () => {
    const mockHandleAddItem = jest.fn(() => false);
    const { result } = renderHook(() => useAddItem({ handleAddItem: mockHandleAddItem }));

    // 新規追加ダイアログを開き、文字を入力
    act(() => result.current.handleOpenAddItem());
    act(() => result.current.handleChangeAddItemValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addItemValue).toBe('test');

    // 送信
    act(() => result.current.handleSubmitAddItem());
    expect(mockHandleAddItem).toBeCalledWith('test');
    expect(result.current.isOpenAddModal).toBe(true);
  });
});
