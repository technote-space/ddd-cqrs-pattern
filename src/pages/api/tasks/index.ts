import type { CreateData } from '^/usecase/task/createTaskUseCase';
import type { TaskDto } from '^/usecase/task/taskDto';
import type { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import '^/config/registry';
import { container } from 'tsyringe';
import CreateTaskController from '^/presentation/createTaskController';
import FetchTasksController from '^/presentation/fetchTasksController';
import { setupNextApi } from '^/presentation/shared/baseController';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await setupNextApi('GET', container.resolve(FetchTasksController), req, res)) return;
  if (await setupNextApi('POST', container.resolve(CreateTaskController), req, res)) return;
  res.status(404).end();
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
