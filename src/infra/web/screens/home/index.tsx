import type { ScreenProps } from '$/web/pages';
import type { IHomeScreen } from '$/web/screens/home';
import type { VFC } from 'react';
import { memo } from 'react';
import { singleton } from 'tsyringe';
import { useHooks } from './hooks';
import View from './view';

@singleton()
export class HomeScreen implements IHomeScreen {
  public create(): VFC<ScreenProps> {
    const component = memo((props: ScreenProps) => <View {...useHooks(props)} />);
    component.displayName = 'HomeScreen';

    return component;
  }
}
