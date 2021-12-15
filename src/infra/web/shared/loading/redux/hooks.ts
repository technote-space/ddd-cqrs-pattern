import type {
  StoreContext,
  useAddProcess as useAddProcessType,
  useDeleteProcess as useDeleteProcessType,
  useIsProcessRunning as useIsProcessRunningType,
  useLoading as useLoadingType,
  useProcess as useProcessType,
} from '$/web/shared/loading';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingContext } from '.';

export const useProcess: useProcessType = () => {
  /* istanbul ignore next */
  const selector = (state: { loading: StoreContext }) => state.loading.process;
  return useSelector(selector);
};

export const useAddProcess: useAddProcessType = () => {
  const dispatch = useDispatch();
  return useCallback((id: string, message?: string) => {
    dispatch({ type: LoadingContext.ADD_LOADING, id, message });
  }, [dispatch]);
};

export const useDeleteProcess: useDeleteProcessType = () => {
  const dispatch = useDispatch();
  return useCallback((id: string) => {
    dispatch({ type: LoadingContext.DELETE_LOADING, id });
  }, [dispatch]);
};

const generateRandomString = (): string => {
  const string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(Array(32)).map(() => string[Math.floor(Math.random() * string.length)]).join('');
};

export const useLoading: useLoadingType = () => {
  const addProcess = useAddProcess();
  const deleteProcess = useDeleteProcess();

  return useCallback(async (callback, message, identifier) => {
    const id = identifier ?? generateRandomString();
    try {
      addProcess(id, message);
      return await callback();
    } finally {
      deleteProcess(id);
    }
  }, [addProcess, deleteProcess]);
};

export const useIsProcessRunning: useIsProcessRunningType = () => {
  const process = useProcess();
  return useCallback((identifier: string) => {
    return !!process.find(process => process.id === identifier);
  }, [process]);
};
