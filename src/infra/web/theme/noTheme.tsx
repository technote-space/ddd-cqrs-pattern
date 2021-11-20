import type { ITheme } from '$/web/theme';
import type { VFC, ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { singleton } from 'tsyringe';

@singleton()
export class NoTheme implements ITheme {
  private readonly __component: VFC<{ children?: ReactNode }>;

  public constructor() {
    this.__component = NoTheme.getComponent();
  }

  public render(children?: ReactNode): ReactElement {
    const Component = this.__component;
    return <Component>
      {children}
    </Component>;
  }

  private static getComponent(): VFC {
    const component = memo(({ children }) => <>
      {children}
    </>);
    component.displayName = 'ThemeProvider';

    return component;
  }
}
