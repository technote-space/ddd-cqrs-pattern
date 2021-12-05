import type { LoginData, ResultData } from '^/presentation/loginOrRegisterController';
import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';
import LoginOrRegisterController from '^/presentation/loginOrRegisterController';
import { setupNextApi } from '^/presentation/shared/baseController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await setupNextApi('POST', container.resolve(LoginOrRegisterController), req, res)) return;
  res.status(404).end();
}

export type Methods = {
  post: {
    reqBody: LoginData;
    resBody: ResultData;
  };
}
