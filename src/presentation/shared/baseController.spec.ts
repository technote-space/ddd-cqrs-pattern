import type { Result } from './baseController';
import InvalidControl from '$/shared/exceptions/domain/invalidControl';
import Forbidden from '$/shared/exceptions/http/forbidden';
import BaseController from './baseController';

class TestController extends BaseController {
  public constructor(private result?: Result | undefined, private error?: Error) {
    super();
  }

  protected execute(): Promise<Result | void> {
    if (this.error) {
      throw this.error;
    }

    return Promise.resolve(this.result);
  }
}

describe('BaseController', () => {
  it('結果が空の場合は status = 204 の結果が返る', async () => {
    const controller = new TestController();

    const response = await controller.invoke();

    expect(response).toEqual({ status: 204 });
  });

  it('結果が空ではない場合は結果が返る', async () => {
    const result = {
      data: {
        test: '123',
      },
    };
    const controller = new TestController(result);

    const response = await controller.invoke();

    expect(response).toEqual(result);
  });

  it('ドメインエラー', async () => {
    const controller = new TestController(undefined, new InvalidControl('test'));

    const response = await controller.invoke();

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

    const response = await controller.invoke();

    expect(response).toEqual({
      status: 403,
      message: 'Forbidden',
    });
  });

  it('その他のエラー', async () => {
    const controller = new TestController(undefined, new Error());

    await expect(controller.invoke()).rejects.toThrow();
  });
});
