import type { IApi, ApiType, ApiSelector, Caller, ResponseData, SWRResponse } from '$/web/shared/api';
import type { IAuthContext } from '$/web/shared/auth';
import type { ApiInstance } from '^/pages/api/$api';
import useAspidaSWR from '@aspida/swr';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Api implements IApi {
  public constructor(
    @inject('client') private client: ApiInstance,
    @inject('IAuthContext') private authContext: IAuthContext,
  ) {
  }

  public useSWR<T extends ApiType>(selector: ApiSelector<T>): SWRResponse<ResponseData<T['$get']>> {
    const dispatch = useDispatch();
    const [api, ...option] = selector(this.client);
    const result = useAspidaSWR(api, ...option);

    if (result.error) {
      // TODO: 認証エラーの場合にログアウト状態にする
      this.authContext.setUser(dispatch, { isLoggedIn: false });
    }

    return result;
  }

  public useCaller(): Caller {
    const dispatch = useDispatch();

    return useCallback(async generatePromise => {
      try {
        return await generatePromise(this.client);
      } catch (e) {
        // TODO: 認証エラーの場合にログアウト状態にする
        this.authContext.setUser(dispatch, { isLoggedIn: false });
        throw e;
      }
    }, [dispatch]);
  }
}
