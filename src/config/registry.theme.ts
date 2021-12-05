import { container } from 'tsyringe';
import { DarkMode } from '@/web/theme/darkMode';
import { NoTheme } from '@/web/theme/noTheme';

container.registerSingleton('ITheme', NoTheme);
container.registerSingleton('IDarkMode', DarkMode);
