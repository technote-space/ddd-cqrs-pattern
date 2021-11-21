import type { AppProps } from 'next/app';

export interface IApp {
  create(): (props: AppProps) => JSX.Element;
}
