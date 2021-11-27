import type { RestHandler } from 'msw';
import type { DefaultRequestBody } from 'msw/lib/types/handlers/RequestHandler';
import type { RequestParams, RestRequest } from 'msw/lib/types/handlers/RestHandler';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockNotionBaseUrl = 'https://example.com';
type Method = keyof typeof rest;
type Body = Record<string, any> | ((req: RestRequest<DefaultRequestBody, RequestParams>) => Record<string, any>);
type TestRequest = (req: RestRequest<DefaultRequestBody, RequestParams>) => void;
export const createHandler = (method: Method, path: string, status: number, jsonBody: Body, testRequest?: TestRequest): RestHandler => rest[method](path, (req, res, ctx) => {
  if (testRequest) testRequest(req);
  return res(
    ctx.status(status),
    ctx.json(typeof jsonBody === 'function' ? jsonBody(req) : jsonBody),
  );
});
export const createNotionHandler = (method: Method, path: string, status: number, jsonBody: Body, testRequest?: TestRequest): RestHandler => createHandler(method, `${mockNotionBaseUrl}/v1${path}`, status, jsonBody, testRequest);
export const useMockServer = (handlers: RestHandler[]) => {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
