import type { IIndexPage, Props } from '$/web/pages';
import type { IAuth } from '$/web/shared/auth';
import type { ILayoutComponent } from '$/web/shared/layout';
import type { VFC } from 'react';
import { memo } from 'react';
import { inject, singleton } from 'tsyringe';
import { useHooks } from './hooks';
import View from './view';

@singleton()
export class IndexPage implements IIndexPage {
  public constructor(
    @inject('IAuth') private auth: IAuth,
    @inject('ILayoutComponent') private layout: ILayoutComponent,
  ) {
  }

  public create(): VFC<Props> {
    const component = memo((props: Props) => this.layout.render({
      ...props,
      children: <View {...useHooks(props, this.auth)} />,
    }));
    component.displayName = 'IndexPage';

    return component;
  }
}
