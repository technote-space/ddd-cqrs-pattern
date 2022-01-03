import { renderHook, act } from '@testing-library/react-hooks';
import { useDeleteItem } from './deleteItem';

describe('useDeleteItem', () => {
  it('削除の動作確認', () => {
    const mockHandleDeleteItem = jest.fn(() => true);
    const { result } = renderHook(() => useDeleteItem({ items: ['item'], handleDeleteItem: mockHandleDeleteItem }));

    expect(result.current.deleteItemHandlers).toHaveProperty('item');

    // 削除
    act(() => result.current.deleteItemHandlers['item']());
    expect(mockHandleDeleteItem).toBeCalledWith('item');
  });
});
