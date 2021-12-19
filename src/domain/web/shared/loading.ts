import type { IComponent } from '$/web/shared/component';
import type { IContext } from '$/web/shared/store';

export type LoadingProcess = {
  id: string;
  message?: string;
  progress?: number;
};
export type StoreContext = {
  process: Array<LoadingProcess>;
};

export type ILoadingContext = IContext<StoreContext>

export type useProcess = () => Array<LoadingProcess>;
export type useAddProcess = () => (id: string, message?: string) => void;
export type useDeleteProcess = () => (id: string) => void;
export type useLoading = () => <T>(callback: () => Promise<T>, message?: string, identifier?: string) => Promise<T>;
export type useIsProcessRunning = () => (identifier: string) => boolean;

export type ILoadingComponent = IComponent
