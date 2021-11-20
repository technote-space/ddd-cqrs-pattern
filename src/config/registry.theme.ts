import { container } from 'tsyringe';
import { NoDarkMode } from '@/web/theme/noDarkMode';
import { NoTheme } from '@/web/theme/noTheme';

container.registerSingleton('ITheme', NoTheme);
container.registerSingleton('IDarkMode', NoDarkMode);
