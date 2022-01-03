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
export type ApiSelector<T extends ApiType> = (client: ApiInstance) => [T, ...Options<T['$get']>];
export type PromiseGenerator<DataType, F extends DataType | undefined> = (client: ApiInstance, fallback: F) => Promise<DataType | F>;
export type Caller = <DataType, F extends DataType | undefined>(generatePromise: PromiseGenerator<DataType, F>, fallback: F, message?: string, throwError?: boolean) => ReturnType<PromiseGenerator<DataType, F>>;

export interface IApi {
  useSWR<T extends ApiType>(selector: ApiSelector<T>): SWRResponse<ResponseData<T['$get']>>;

  useCaller(): Caller;
}
