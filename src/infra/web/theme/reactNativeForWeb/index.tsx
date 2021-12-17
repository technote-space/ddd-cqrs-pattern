import type { ITheme, Props } from '$/web/theme';
import type { VFC } from 'react';
import { singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';
import View from './view';

@singleton()
export default class ReactNativeForWebTheme extends BaseComponent<Props> implements ITheme {
  public constructor() {
    super();
  }

  protected getComponent(): VFC<Props> {
    return View;
  }
}
