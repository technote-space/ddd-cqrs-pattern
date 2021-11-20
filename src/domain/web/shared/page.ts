import type { VFC } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ServerProps = {};

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IPage<P = {}> {
  create(): VFC<P>;
}
