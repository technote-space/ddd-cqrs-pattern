import type { IAuth } from '$/web/shared/auth';
import type { ILayoutComponent } from '$/web/shared/layout';
import type { ILoadingComponent } from '$/web/shared/loading';
import type { VFC } from 'react';
import { memo } from 'react';
import { singleton, inject } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';
import { useHooks } from './hooks';
import View from './view';

@singleton()
export default class LayoutComponent extends BaseComponent implements ILayoutComponent {
  public constructor(
    @inject('ILoadingComponent') private loadingComponent: ILoadingComponent,
    @inject('IAuth/front') private auth: IAuth,
  ) {
    super();
  }

  protected getComponent(): VFC {
    const component = memo(({ children }) => <View {...useHooks(this.auth)}>
      {children}
      {this.loadingComponent.render({})}
    </View>);
    component.displayName = 'LayoutComponent';

    return component;
  }
}
