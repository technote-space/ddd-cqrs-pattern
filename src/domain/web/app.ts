import type { AppProps } from 'next/app';

export interface IAppService {
  create(): (props: AppProps) => JSX.Element;
}
