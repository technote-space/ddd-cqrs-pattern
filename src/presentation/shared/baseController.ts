import DomainException from '$/shared/exceptions/domain/exception';
import HttpException from '$/shared/exceptions/http/exception';

export type BodyType = Record<string, any> | undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/ban-types
export type Request<Body extends BodyType = undefined> = (Body extends undefined ? {} : { body: Body; }) & {
  query: {
    [key: string]: string | string[];
  };
  headers: {
    [key: string]: string;
  };
};
export type Result = {
  status: 204;
} | {
  status?: 200 | 201;
  data: Record<string, any> | Record<string, any>[], // eslint-disable-line @typescript-eslint/no-explicit-any
};
export type ErrorResult = {
  status: number;
  message: string;
  context?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};
export type ReturnType = Result | ErrorResult;

export default abstract class BaseController<Body extends BodyType = undefined> {
  protected abstract execute(request: Request<Body>): Promise<Result | void>;

  public async invoke(request: Request<Body>): Promise<ReturnType> {
    try {
      const result = await this.execute(request);
      if (!result) {
        return {
          status: 204,
        };
      }

      return result;
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
