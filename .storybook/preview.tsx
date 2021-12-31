import 'reflect-metadata';
import { Story } from '@storybook/react';
import { NativeBaseProvider, View as ViewComponent } from 'native-base';

const withTheme = (Story: Story) => {
  return <NativeBaseProvider>
    <ViewComponent
      display="flex"
      height="100%"
      overflow="hidden"
    >
      <Story/>
    </ViewComponent>
  </NativeBaseProvider>;
};
export const decorators = [withTheme];
export const parameters = {
  actions: { argTypesRegex: '^(on|handle)[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
