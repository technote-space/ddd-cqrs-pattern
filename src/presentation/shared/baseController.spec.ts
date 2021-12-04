import type { Result } from './baseController';
import type { ResultData } from './baseController';
import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Forbidden from '$/shared/exceptions/http/forbidden';
import { createRequest } from '^/__mocks__/request';
import BaseController from './baseController';

class TestController<T extends ResultData = undefined> extends BaseController<T> {
  public constructor(private result?: Result<T> | undefined, private error?: Error, private callback?: (controller: TestController<T>) => void) {
    super();
  }

  protected execute(): Promise<Result<T> | void> {
    if (this.error) {
      throw this.error;
    }

    if (this.callback) {
      this.callback(this);
    }

    return Promise.resolve(this.result);
  }

  public _getAuthorizationHeader() {
    return this.getAuthorizationHeader();
  }

  public _getQuery(name: string) {
    return this.getQuery(name);
  }
}

describe('BaseController', () => {
  it('結果が空の場合は status = 204 の結果が返る', async () => {
    const controller = new TestController();

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({ status: 204 });
  });

  it('結果が空ではない場合は結果が返る', async () => {
    const result = {
      status: 201,
      data: {
        test: '123',
      },
    } as Result<{ test: string }>;
    const controller = new TestController(result);

    const response = await controller.invoke(createRequest());

    expect(response).toEqual(result);
  });

  it('status が指定されていない場合は 200', async () => {
    const result = {
      data: {
        test: '123',
      },
    };
    const controller = new TestController(result);

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({
      status: 200,
      ...result,
    });
  });

  it('ドメインエラー', async () => {
    const controller = new TestController(undefined, new InvalidControl('test'));

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({
      status: 409,
      message: 'その操作は許可されていません',
      context: {
        reason: 'test',
      },
    });
  });

  it('HTTPエラー', async () => {
    const controller = new TestController(undefined, new Forbidden());

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({
      status: 403,
      message: 'Forbidden',
    });
  });

  it('その他のエラー', async () => {
    const controller = new TestController(undefined, new Error());

    await expect(controller.invoke(createRequest())).rejects.toThrow();
  });

  it('設定されていない認証トークンを取得しようとするとエラー', async () => {
    const controller = new TestController(undefined, undefined, (controller => {
      controller._getAuthorizationHeader();
    }));

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({
      status: 400,
      message: '無効な値です',
      context: {
        target: 'Authorization',
        reason: 'ヘッダーに認証トークンが設定されていません',
      },
    });
  });

  it('設定されていないPathクエリを取得しようとするとエラー', async () => {
    const controller = new TestController(undefined, undefined, (controller => {
      controller._getQuery('');
    }));

    const response = await controller.invoke(createRequest());

    expect(response).toEqual({
      status: 400,
      message: '無効な値です',
      context: {
        target: '',
        reason: 'Pathクエリが設定されていません',
      },
    });
  });

  it('Pathクエリの形式が正しくないとエラー', async () => {
    const controller = new TestController(undefined, undefined, (controller => {
      controller._getQuery('test');
    }));

    const response = await controller.invoke(createRequest({
      query: {
        test: [''] as never,
      },
    }));

    expect(response).toEqual({
      status: 400,
      message: '無効な値です',
      context: {
        target: 'test',
        reason: 'Pathクエリの形式が正しくありません',
      },
    });
  });
});
