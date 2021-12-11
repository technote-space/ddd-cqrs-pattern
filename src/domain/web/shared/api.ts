/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiInstance } from '^/pages/api/$api';
import type { SWRResponse, SWRConfiguration } from 'swr';

export type ApiType = Record<string, any> & {
  $get: (option: any) => Promise<any>;
  $path: (option?: any) => string;
};
export type ResponseData<T extends (option: any) => Promise<any>> = ReturnType<T> extends Promise<infer S> ? S : never;
export type Options<T extends (option: any) => Promise<any>> = Parameters<Parameters<T> extends [Parameters<T>[0]] ? (option: Parameters<T>[0] & SWRConfiguration<ResponseData<T>> & {
  enabled?: boolean;
}) => void : (option?: Parameters<T>[0] & SWRConfiguration<ResponseData<T>> & {
  enabled?: boolean;
}) => void>;
export type { SWRResponse, SWRConfiguration };

export interface IApi {
  getClient(): ApiInstance;

  useSWR<T extends ApiType>(api: T, ...option: Options<T['$get']>): SWRResponse<ResponseData<T['$get']>>;

  call<T>(promise: Promise<T>): Promise<T>;
}
