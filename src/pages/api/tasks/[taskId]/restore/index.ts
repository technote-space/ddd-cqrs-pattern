import type { TaskDto } from '^/usecase/task/taskDto';
import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';
import RestoreTaskController from '^/presentation/restoreTaskController';
import { setupNextApi } from '^/presentation/shared/baseController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await setupNextApi('PATCH', container.resolve(RestoreTaskController), req, res)) return;
  res.status(405).json({ error: { httpStatus: 405, message: 'Method Not Allowed' } });
}

export type Methods = {
  patch: {
    reqHeaders: { authorization: string };
    resBody: TaskDto;
  };
}
