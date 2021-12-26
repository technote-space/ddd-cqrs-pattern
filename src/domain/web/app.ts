import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';

export interface IApp {
  create(): (props: AppProps) => ReactElement;
}
