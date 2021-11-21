import type { IComponent } from '$/web/shared/component';
import type { VFC, ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class BaseComponent<P = {}> implements IComponent<P> {
  private readonly __component: VFC<P>;

  protected constructor() {
    this.__component = this.getComponent();
  }

  protected abstract getComponent(): VFC<P>;

  public render(props: P): ReactElement {
    const Component = this.__component;
    return <Component {...props} />;
  }
}
