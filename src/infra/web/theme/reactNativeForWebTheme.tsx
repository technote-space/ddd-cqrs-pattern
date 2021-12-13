import type { ITheme, Props } from '$/web/theme';
import type { VFC } from 'react';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { singleton } from 'tsyringe';
import { BaseComponent } from '@/web/shared/component';

@singleton()
export class ReactNativeForWebTheme extends BaseComponent<Props> implements ITheme {
  private styles: ReturnType<typeof StyleSheet.create>;

  public constructor() {
    super();

    this.styles = StyleSheet.create({
      root: {
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
      },
    });
  }

  protected getComponent(): VFC<Props> {
    const component = memo(({ children }) => <View style={this.styles.root}>
      {children}
    </View>);
    component.displayName = 'ThemeProvider';

    return component;
  }
}
