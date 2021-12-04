import type { NextApiRequest } from 'next';

type Params<T> = {
  query?: Record<string, string>;
  body?: T;
  headers?: Record<string, string>;
};
export const createRequest = <T>(params?: Params<T>): NextApiRequest => ({
  query: params?.query ?? {},
  headers: params?.headers ?? {},
  body: params?.body,
}) as NextApiRequest;
