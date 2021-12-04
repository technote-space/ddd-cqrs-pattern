import type { CreateData } from '^/usecase/task/createTaskUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { container } from 'tsyringe';
import CreateTaskController from '^/presentation/createTaskController';
import FetchTasksController from '^/presentation/fetchTasksController';
import { setupNextApi } from '^/presentation/shared/baseController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await setupNextApi('GET', container.resolve(FetchTasksController), req, res);
  await setupNextApi('POST', container.resolve(CreateTaskController), req, res);
}

export type Methods = {
  get: {
    reqHeaders: { Authorization: string };
    resBody: TaskDto[];
  };
  post: {
    reqHeaders: { Authorization: string };
    reqBody: CreateData;
    resBody: TaskDto;
  };
}
