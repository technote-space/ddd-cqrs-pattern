import { renderHook, act } from '@testing-library/react-hooks';
import { useHooks } from '.';

describe('useHooks', () => {
  it('追加の動作確認', () => {
    const mockOnChange = jest.fn(() => true);
    const { result } = renderHook(() => useHooks({
      field: { value: ['tag'], onChange: mockOnChange },
      isDisabled: false,
    } as never));

    expect(result.current.tags).toEqual(['tag']);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.placeholder).toBeUndefined();

    // 追加
    act(() => result.current.handleOpenAddTag());
    act(() => result.current.handleChangeAddTagValue('test'));
    expect(result.current.isOpenAddModal).toBe(true);
    expect(result.current.addTagValue).toBe('test');

    act(() => result.current.handleSubmitAddTag());
    expect(mockOnChange).toBeCalledWith(['tag', 'test']);
    expect(result.current.isOpenAddModal).toBe(false);
  });

  it('削除の動作確認', () => {
    const mockOnChange = jest.fn(() => true);
    const { result } = renderHook(() => useHooks({
      field: { value: ['tag'], onChange: mockOnChange },
      isDisabled: false,
    } as never));

    expect(result.current.tags).toEqual(['tag']);
    expect(result.current.isDisabled).toBe(false);
    expect(result.current.placeholder).toBeUndefined();

    // 削除
    act(() => result.current.deleteTagHandlers['tag']());
    expect(mockOnChange).toBeCalledWith([]);
  });
});
