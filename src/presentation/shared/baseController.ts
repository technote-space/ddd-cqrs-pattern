import type { ErrorStatus } from '$/shared/exceptions/exception';
import DomainException from '$/shared/exceptions/domain/exception';
import HttpException from '$/shared/exceptions/http/exception';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BodyType = Record<string, any> | undefined;
// eslint-disable-next-line @typescript-eslint/ban-types
export type Request<Body extends BodyType = undefined> = (Body extends undefined ? {} : { body: Body; }) & {
  query?: {
    [key: string]: string | string[];
  };
  headers?: {
    [key: string]: string;
  };
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultData = Record<string, any> | Record<string, any>[] | undefined;
export type Result<Data extends ResultData = undefined> = Data extends undefined ? {
  status: 204;
} : {
  status?: 200 | 201;
  data: Data,
};
export type ErrorResult = {
  status: ErrorStatus;
  message: string;
  context?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};
export type ReturnType<Data extends ResultData = undefined> = Result<Data> | ErrorResult;

export default abstract class BaseController<Data extends ResultData = undefined, Body extends BodyType = undefined> {
  protected abstract execute(request: Request<Body>): Promise<Result<Data> | void>;

  public async invoke(request: Request<Body>): Promise<ReturnType<Data>> {
    try {
      const result = await this.execute(request);
      if (!result) {
        return {
          status: 204,
        } as Result<Data>;
      }

      return {
        status: 200,
        ...result,
      };
    } catch (error) {
      if (error instanceof DomainException) {
        return {
          status: error.status,
          message: error.message,
          context: error.context,
        };
      }

      if (error instanceof HttpException) {
        return {
          status: error.status,
          message: error.message,
        };
      }

      throw error;
    }
  }
}
