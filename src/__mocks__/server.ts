import type { RestHandler } from 'msw';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const mockNotionBaseUrl = 'https://example.com';
type Method = keyof typeof rest;
export const createHandler = (method: Method, path: string, status: number, jsonBody: any): RestHandler => rest[method](path, (req, res, ctx) => res(
  ctx.status(status),
  ctx.json(jsonBody),
));
export const createNotionHandler = (method: Method, path: string, status: number, jsonBody: any): RestHandler => createHandler(method, `${mockNotionBaseUrl}/v1${path}`, status, jsonBody);
export const useMockServer = (handlers: RestHandler[]) => {
  const server = setupServer(...handlers);
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
