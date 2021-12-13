import type { ITheme } from '$/web/theme';
import 'reflect-metadata';
import '^/config/registry.theme';
import { container } from 'tsyringe';
import { Story } from '@storybook/react';

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
