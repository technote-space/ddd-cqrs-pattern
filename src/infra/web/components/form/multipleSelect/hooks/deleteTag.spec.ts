import { renderHook, act } from '@testing-library/react-hooks';
import { useDeleteTag } from './deleteTag';

describe('useDeleteTag', () => {
  it('削除の動作確認', () => {
    const mockHandleDeleteTag = jest.fn(() => true);
    const { result } = renderHook(() => useDeleteTag({ tags: ['tag'], handleDeleteTag: mockHandleDeleteTag }));

    expect(result.current.deleteTagHandlers).toHaveProperty('tag');

    // 削除
    act(() => result.current.deleteTagHandlers['tag']());
    expect(mockHandleDeleteTag).toBeCalledWith('tag');
  });
});
