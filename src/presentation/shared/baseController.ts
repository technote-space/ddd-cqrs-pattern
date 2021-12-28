import type { ISlack } from '$/server/shared/slack';
import type { ErrorStatus } from '$/shared/exceptions/exception';
import type { NextApiRequest, NextApiResponse } from 'next';
import DomainException from '$/shared/exceptions/domain/exception';
import InvalidValueException from '$/shared/exceptions/domain/invalidValue';
import ValidationException from '$/shared/exceptions/domain/validation';
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
  data: undefined,
} : {
  status?: 200 | 201;
  data: Data,
};
export type ErrorResult = {
  status: ErrorStatus;
  data: {
    message: string;
    context?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    stack?: string,
  }
};
export type ReturnType<Data extends ResultData = undefined> = Required<Result<Data>> | ErrorResult;

export default abstract class BaseController<Data extends ResultData = undefined, Body extends BodyType = undefined> {
  private request!: NextApiRequest;

  protected constructor(private slack: ISlack) {
  }

  protected abstract execute(): Promise<Result<Data> | void>;

  protected getAuthorizationHeader(): string {
    if (!this.request.headers.authorization) {
      throw new InvalidValueException('Authorization', 'ヘッダーに認証トークンが設定されていません');
    }

    return this.request.headers.authorization;
  }

  protected getBody(): Body {
    return this.request.body;
  }

  protected getQuery(name: string): string {
    const value = this.request.query[name];
    if (!value) {
      throw new InvalidValueException(name, 'Pathクエリが設定されていません');
    }

    if (Array.isArray(value)) {
      throw new InvalidValueException(name, 'Pathクエリの形式が正しくありません');
    }

    return value;
  }

  public async invoke(request: NextApiRequest): Promise<ReturnType<Data>> {
    this.request = request;
    try {
      const result = await this.execute();
      if (!result || !('data' in result)) {
        return {
          status: 204,
        } as Required<Result<Data>>;
      }

      return {
        status: result.status ?? 200,
        data: result.data,
      } as Required<Result<Data>>;
    } catch (error) {
      if (error instanceof Error && !(error instanceof ValidationException)) {
        await this.slack.sendError(error);
      }

      if (error instanceof DomainException) {
        return {
          status: error.status,
          data: {
            message: error.message,
            context: error.context,
            stack: error.stack,
          },
        };
      }

      if (error instanceof HttpException) {
        return {
          status: error.status,
          data: {
            message: error.message,
            stack: error.stack,
          },
        };
      }

      throw error;
    }
  }
}

/* istanbul ignore next */
export const setupNextApi = async (method: string, controller: BaseController<any, any>, req: NextApiRequest, res: NextApiResponse): Promise<boolean> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (req.method === method) {
    const result = await controller.invoke(req);
    res.status(result.status).json(result.data);
    return true;
  }

  return false;
};
