import type { ITheme, Props } from '$/web/theme';
import type { VFC } from 'react';
import { memo } from 'react';
import { singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';

@singleton()
export class EmptyTheme extends BaseComponent<Props> implements ITheme {
  public constructor() {
    super();
  }

  protected getComponent(): VFC<Props> {
    const component = memo(({ children }) => <div className="empty-theme">
      {children}
    </div>);
    component.displayName = 'EmptyTheme';

    return component;
  }
}
