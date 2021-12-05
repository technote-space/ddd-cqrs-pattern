import { container } from 'tsyringe';
import { NoTheme } from '@/web/theme/noTheme';

container.registerSingleton('ITheme', NoTheme);
