import type { ReactElement, ReactNode } from 'react';

export interface ITheme {
  render(children?: ReactNode): ReactElement;
}
