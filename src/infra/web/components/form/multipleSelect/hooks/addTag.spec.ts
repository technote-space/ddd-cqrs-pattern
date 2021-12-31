import { renderHook, act } from '@testing-library/react-hooks';
import { useAddTag } from './addTag';

describe('useAddTag', () => {
  it('新規追加の動作確認', () => {
    const mockHandleAddTag = jest.fn(() => true);
    const { result } = renderHook(() => useAddTag({ handleAddTag: mockHandleAddTag }));

    expect(result.current.addTagValue).toBe('');
    expect(result.current.isOpenAddModal).toBe(false);

    // 新規追加ダイアログを開く
    act(() => result.current.handleOpenAddTag());
    expect(result.current.isOpenAddModal).toBe(true);

    // 文字の入力
    act(() => result.current.handleChangeAddTagValue('test'));
    expect(result.current.addTagValue).toBe('test');

    // 新規追加ダイアログを閉じる
    act(() => result.current.handleCloseAddTag());
    expect(result.current.isOpenAddModal).toBe(false);

    // 再度、新規追加ダイアログを開き、文字を入力
    act(() => result.current.handleOpenAddTag());
    act(() => result.current.handleChangeAddTagValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addTagValue).toBe('test');

    // 送信
    act(() => result.current.handleSubmitAddTag());
    expect(mockHandleAddTag).toBeCalledWith('test');
    expect(result.current.isOpenAddModal).toBe(false);
  });

  it('重複タグを追加時にモーダルが閉じないことを確認', () => {
    const mockHandleAddTag = jest.fn(() => false);
    const { result } = renderHook(() => useAddTag({ handleAddTag: mockHandleAddTag }));

    // 新規追加ダイアログを開き、文字を入力
    act(() => result.current.handleOpenAddTag());
    act(() => result.current.handleChangeAddTagValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addTagValue).toBe('test');

    // 送信
    act(() => result.current.handleSubmitAddTag());
    expect(mockHandleAddTag).toBeCalledWith('test');
    expect(result.current.isOpenAddModal).toBe(true);
  });
});
