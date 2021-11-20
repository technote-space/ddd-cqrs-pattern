import type { IComponent } from '$/web/shared/component';
import type { VFC, PropsWithChildren, ReactElement, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class BaseComponent<P = {}> implements IComponent<P> {
  private readonly __component: VFC<P>;

  protected constructor() {
    this.__component = this.getComponent();
  }

  protected abstract getComponent(): VFC<P>;

  public render(props?: P, children?: ReactNode): ReactElement {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = this.__component as VFC<PropsWithChildren<any>>;
    return <Component {...props}>
      {children}
    </Component>;
  }
}
