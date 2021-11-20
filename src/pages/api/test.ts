import type {NextApiRequest, NextApiResponse} from 'next';

type Response = {
  message: string
}

export default (req: NextApiRequest, res: NextApiResponse<Response>) => {
  res.status(200).json({message: 'Hello World!'});
}

export type Methods = {
  get: Response
}
