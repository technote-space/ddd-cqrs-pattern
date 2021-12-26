import type {
  useAddProcess as useAddProcessType,
  useDeleteProcess as useDeleteProcessType,
  useIsProcessRunning as useIsProcessRunningType,
  useLoading as useLoadingType,
  useProcess as useProcessType,
} from '$/web/shared/loading';
import { container } from 'tsyringe';

/* istanbul ignore next */
export const useProcess: useProcessType = () => container.resolve<useProcessType>('useProcess')();
/* istanbul ignore next */
export const useAddProcess: useAddProcessType = () => container.resolve<useAddProcessType>('useAddProcess')();
/* istanbul ignore next */
export const useDeleteProcess: useDeleteProcessType = () => container.resolve<useDeleteProcessType>('useDeleteProcess')();
/* istanbul ignore next */
export const useLoading: useLoadingType = () => container.resolve<useLoadingType>('useLoading')();
/* istanbul ignore next */
export const useIsProcessRunning: useIsProcessRunningType = () => container.resolve<useIsProcessRunningType>('useIsProcessRunning')();
