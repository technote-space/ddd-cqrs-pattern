import type { IIndexPage, Props } from '$/web/pages';
import type { VFC } from 'react';
import { memo } from 'react';
import { singleton } from 'tsyringe';
import { useHooks } from './hooks';
import View from './view';

@singleton()
export class IndexPage implements IIndexPage {
  public create(): VFC<Props> {
    const component = memo((props: Props) => <View {...useHooks(props)} />);
    component.displayName = 'IndexPage';

    return component;
  }
}
