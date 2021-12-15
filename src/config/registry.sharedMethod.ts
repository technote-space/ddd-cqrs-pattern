import { container } from 'tsyringe';
import {
  useProcess,
  useAddProcess,
  useDeleteProcess,
  useLoading,
  useIsProcessRunning,
} from '@/web/shared/loading/redux/hooks';
import { useDarkMode, useToggleDarkMode } from '@/web/theme/drakMode/redux/hooks';

container.registerInstance('useProcess', useProcess);
container.registerInstance('useAddProcess', useAddProcess);
container.registerInstance('useDeleteProcess', useDeleteProcess);
container.registerInstance('useLoading', useLoading);
container.registerInstance('useIsProcessRunning', useIsProcessRunning);
container.registerInstance('useDarkMode', useDarkMode);
container.registerInstance('useToggleDarkMode', useToggleDarkMode);
