import type { IApi, ApiType, ApiSelector, Caller, ResponseData, SWRResponse } from '$/web/shared/api';
import type { IAuthContext } from '$/web/shared/auth';
import type { IToast } from '$/web/shared/toast';
import type { ApiInstance } from '^/pages/api/$api';
import type { AxiosError } from 'axios';
import useAspidaSWR from '@aspida/swr';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { inject, singleton } from 'tsyringe';
import { PromiseGenerator } from '$/web/shared/api';
import { useLoading } from '@/web/shared/loading';

@singleton()
export default class Api implements IApi {
  public constructor(
    @inject('client') private client: ApiInstance,
    @inject('IAuthContext') private authContext: IAuthContext,
    @inject('IToast') private toast: IToast,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isAxiosError(error?: any): error is AxiosError {
    return !!error?.isAxiosError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static isAuthError(error?: any): boolean {
    return Api.isAxiosError(error) && error.response?.status === 401;
  }

  public useSWR<T extends ApiType>(selector: ApiSelector<T>): SWRResponse<ResponseData<T['$get']>> {
    const dispatch = useDispatch();
    const [api, ...option] = selector(this.client);
    const result = useAspidaSWR(api, ...option);

    if (Api.isAuthError(result.error)) {
      result.mutate(v => v, false).then();
      this.authContext.setUser(dispatch, { isLoggedIn: false });
    }

    return result;
  }

  public useCaller(): Caller {
    const dispatch = useDispatch();
    const withLoading = useLoading();
    const { show } = this.toast.useToast();

    return useCallback(async <DataType, F extends DataType | undefined>(generatePromise: PromiseGenerator<DataType, F>, fallback: F, message?: string, throwError?: boolean) => {
      try {
        return await withLoading(() => generatePromise(this.client, fallback), message);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (Api.isAuthError(e)) {
          this.authContext.setUser(dispatch, { isLoggedIn: false });
        } else {
          show({ status: 'error', title: e.response?.data?.context?.reason ?? e.response?.data?.message ?? e.message });
        }

        if (throwError) {
          throw e;
        }

        return fallback;
      }
    }, [dispatch, withLoading, show]);
  }
}
