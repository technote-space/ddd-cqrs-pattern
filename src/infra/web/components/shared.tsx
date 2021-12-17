import type { FC, PropsWithChildren } from 'react';
import { container } from 'tsyringe';

type Props<T> = T extends FC<infer P> ? P : never;
// eslint-disable-next-line react/display-name
export const createView = <T, >(token: string) => (props: PropsWithChildren<Props<T>>) => {
  const Component = container.resolve<FC<Props<T>>>(token);
  return <Component {...props} />;
};
