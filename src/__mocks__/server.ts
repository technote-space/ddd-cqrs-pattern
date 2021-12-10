import type { RestHandler } from 'msw';
import type { RestRequest } from 'msw/lib/types/handlers/RestHandler';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockNotionBaseUrl = 'https://example.com';
type Method = keyof typeof rest;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = Record<string, any> | ((req: RestRequest) => Record<string, any>);
type TestRequest = (req: RestRequest) => void;
export const createHandler = (method: Method, path: string, status: number, jsonBody: Body, testRequest?: TestRequest): RestHandler => rest[method](path, (req, res, ctx) => {
  if (testRequest) testRequest(req);
  return res(
    ctx.status(status),
    ctx.json(typeof jsonBody === 'function' ? jsonBody(req) : jsonBody),
  );
});
export const createNotionHandler = (method: Method, path: string, status: number, jsonBody: Body, testRequest?: TestRequest): RestHandler => createHandler(method, `${mockNotionBaseUrl}/v1${path}`, status, jsonBody, testRequest);
export const createLocalHandler = (method: Method, path: string, status: number, jsonBody: Body, testRequest?: TestRequest): RestHandler => createHandler(method, `http://localhost:3000/api${path}`, status, jsonBody, testRequest);
export const useMockServer = (handlers: RestHandler[]) => {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
