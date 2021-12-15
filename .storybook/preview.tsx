import type { ITheme } from '$/web/theme';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { Story } from '@storybook/react';
import { EmptyTheme } from '@/web/theme/empty';

container.registerSingleton('ITheme', EmptyTheme);

const withTheme = (Story: Story) => {
  return (container.resolve('ITheme') as ITheme).render({ children: <Story/> });
};
export const decorators = [withTheme];
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
