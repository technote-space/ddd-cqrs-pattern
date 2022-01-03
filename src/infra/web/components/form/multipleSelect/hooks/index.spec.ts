import { renderHook, act } from '@testing-library/react-hooks';
import { useHooks } from '.';

describe('useHooks', () => {
  it('追加の動作確認', () => {
    const mockOnChange = jest.fn(() => true);
    const { result } = renderHook(() => useHooks({
      field: { value: ['item'], onChange: mockOnChange },
      isDisabled: false,
    } as never));

    expect(result.current.items).toEqual(['item']);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.placeholder).toBeUndefined();

    // 追加
    act(() => result.current.handleOpenAddItem());
    act(() => result.current.handleChangeAddItemValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addItemValue).toBe('test');

    act(() => result.current.handleSubmitAddItem());
    expect(mockOnChange).toBeCalledWith(['item', 'test']);
    expect(result.current.isOpenAddModal).toBe(false);
  });

  it('削除の動作確認', () => {
    const mockOnChange = jest.fn(() => true);
    const { result } = renderHook(() => useHooks({
      field: { value: ['item'], onChange: mockOnChange },
      isDisabled: false,
    } as never));

    expect(result.current.items).toEqual(['item']);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.placeholder).toBeUndefined();

    // 削除
    act(() => result.current.deleteItemHandlers['item']());
    expect(mockOnChange).toBeCalledWith([]);
  });
});
