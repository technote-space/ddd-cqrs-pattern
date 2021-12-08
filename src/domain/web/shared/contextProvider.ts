/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropsWithChildren, VFC } from 'react';

export interface IContextProvider {
  getProvider(): VFC<PropsWithChildren<any>>;
}
