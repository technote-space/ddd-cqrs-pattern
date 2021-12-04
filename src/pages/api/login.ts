import type { LoginData, ResultData } from '^/presentation/loginOrRegisterController';
import type { NextApiRequest, NextApiResponse } from 'next';
import { container } from 'tsyringe';
import LoginOrRegisterController from '^/presentation/loginOrRegisterController';
import { setupNextApi } from '^/presentation/shared/baseController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await setupNextApi('POST', container.resolve(LoginOrRegisterController), req, res);
}

export type Methods = {
  post: {
    reqBody: LoginData;
    resBody: ResultData;
  };
}
