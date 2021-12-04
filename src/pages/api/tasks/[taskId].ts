import type { TaskDto } from '^/usecase/task/taskDto';
import type { UpdateData } from '^/usecase/task/updateTaskUseCase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { container } from 'tsyringe';
import DeleteTaskController from '^/presentation/deleteTaskController';
import { setupNextApi } from '^/presentation/shared/baseController';
import UpdateTaskController from '^/presentation/updateTaskController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await setupNextApi('PUT', container.resolve(UpdateTaskController), req, res);
  await setupNextApi('DELETE', container.resolve(DeleteTaskController), req, res);
}

export type Methods = {
  put: {
    reqHeaders: { Authorization: string };
    reqBody: UpdateData;
    resBody: TaskDto;
  };
  delete: {
    reqHeaders: { Authorization: string };
    resBody: TaskDto;
  };
}
