import type { AuthHeader } from '^/presentation/shared/userSessionProvider';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { UpdateData } from '^/usecase/task/updateTaskUseCase';
import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';
import DeleteTaskController from '^/presentation/deleteTaskController';
import { setupNextApi } from '^/presentation/shared/baseController';
import UpdateTaskController from '^/presentation/updateTaskController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await setupNextApi('PUT', container.resolve(UpdateTaskController), req, res)) return;
  if (await setupNextApi('DELETE', container.resolve(DeleteTaskController), req, res)) return;
  res.status(405).json({ error: { httpStatus: 405, message: 'Method Not Allowed' } });
}

export type Methods = {
  put: {
    reqHeaders: AuthHeader;
    reqBody: UpdateData;
    resBody: TaskDto;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: TaskDto;
  };
}
