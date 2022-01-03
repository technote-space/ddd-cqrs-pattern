import { renderHook, act } from '@testing-library/react-hooks';
import { useOnSubmit } from './form';

describe('useOnSubmit', () => {
  it('submit', async () => {
    const mockGetCallerParams = jest.fn(() => []);
    const mockCaller = jest.fn(() => Promise.resolve());
    const { result, waitFor } = renderHook(() => useOnSubmit(
      mockGetCallerParams as never,
      { useCaller: () => mockCaller } as never,
    ));

    expect(result.current.validationErrors).toEqual({});

    await act(async () => result.current.onSubmit({}));
    await waitFor(() => expect(mockCaller).toBeCalled());
    expect(mockGetCallerParams).toBeCalledWith({});
  });

  it('submit with afterSubmit', async () => {
    const mockGetCallerParams = jest.fn(() => []);
    const mockCaller = jest.fn(() => Promise.resolve());
    const mockAfterSubmit = jest.fn();
    const { result, waitFor } = renderHook(() => useOnSubmit(
      mockGetCallerParams as never,
      { useCaller: () => mockCaller } as never,
      mockAfterSubmit,
    ));

    expect(result.current.validationErrors).toEqual({});

    await act(async () => result.current.onSubmit({}));
    await waitFor(() => expect(mockCaller).toBeCalled());
    expect(mockGetCallerParams).toBeCalledWith({});
    expect(mockAfterSubmit).toBeCalledTimes(1);
  });

  it('validation error', async () => {
    const mockGetCallerParams = jest.fn(() => []);
    const mockCaller = jest.fn(() => Promise.reject({
      isAxiosError: true,
      response: { status: 422, data: { context: { test: 123 } } },
    }));
    const mockAfterSubmit = jest.fn();
    const { result, waitFor } = renderHook(() => useOnSubmit(
      mockGetCallerParams as never,
      { useCaller: () => mockCaller } as never,
      mockAfterSubmit,
    ));

    expect(result.current.validationErrors).toEqual({});

    await act(async () => result.current.onSubmit({}));
    await waitFor(() => expect(mockCaller).toBeCalled());
    expect(mockGetCallerParams).toBeCalledWith({});
    expect(mockAfterSubmit).not.toBeCalled();
    expect(result.current.validationErrors).toEqual({ test: 123 });

    act(() => result.current.resetValidationErrors());
    expect(result.current.validationErrors).toEqual({});
  });

  it('other error', async () => {
    const mockGetCallerParams = jest.fn(() => []);
    const mockCaller = jest.fn(() => Promise.reject({
      response: { status: 500 },
    }));
    const mockHandleError = jest.fn();
    const { result, waitFor } = renderHook(() => useOnSubmit(
      mockGetCallerParams as never,
      { useCaller: () => mockCaller } as never,
      undefined,
      mockHandleError,
    ));

    expect(result.current.validationErrors).toEqual({});

    await act(async () => result.current.onSubmit({}));
    await waitFor(() => expect(mockCaller).toBeCalled());
    expect(mockGetCallerParams).toBeCalledWith({});
    expect(mockHandleError).toBeCalledTimes(1);
  });
});
