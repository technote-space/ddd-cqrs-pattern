import { container } from 'tsyringe';
import {
  useProcess,
  useAddProcess,
  useDeleteProcess,
  useLoading,
  useIsProcessRunning,
} from '@/web/shared/loading/redux/hooks';

container.registerInstance('useProcess', useProcess);
container.registerInstance('useAddProcess', useAddProcess);
container.registerInstance('useDeleteProcess', useDeleteProcess);
container.registerInstance('useLoading', useLoading);
container.registerInstance('useIsProcessRunning', useIsProcessRunning);
