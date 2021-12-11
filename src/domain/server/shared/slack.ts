export interface ISlack {
  sendOk(text: string, fields?: { title: string; value: string; short?: boolean }[]): Promise<void>;

  sendError(error: Error): Promise<void>;
}
