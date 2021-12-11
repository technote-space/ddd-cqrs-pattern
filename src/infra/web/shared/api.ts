import type { IApi, ApiType, Options, ResponseData, SWRResponse } from '$/web/shared/api';
import type { ApiInstance } from '^/pages/api/$api';
import useAspidaSWR from '@aspida/swr';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Api implements IApi {
  public constructor(
    @inject('client') private client: ApiInstance,
  ) {
  }

  public getClient(): ApiInstance {
    return this.client;
  }

  public useSWR<T extends ApiType>(api: T, ...option: Options<T['$get']>): SWRResponse<ResponseData<T['$get']>> {
    const result = useAspidaSWR(api, ...option);

    // TODO: 認証エラーの場合にログアウト状態にする

    return result;
  }

  public async call<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (e) {
      console.log(e);
      // TODO: 認証エラーの場合にログアウト状態にする
      throw e;
    }
  }
}
