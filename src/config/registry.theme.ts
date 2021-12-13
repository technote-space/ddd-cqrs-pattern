import { container } from 'tsyringe';
import { ReactNativeForWebTheme } from '@/web/theme/reactNativeForWebTheme';

container.registerSingleton('ITheme', ReactNativeForWebTheme);
