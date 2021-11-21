import type { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IComponent<P = {}> {
  render(props: P): ReactElement;
}
