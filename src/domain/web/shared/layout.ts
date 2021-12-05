import type { Props as PageProps } from '$/web/pages';
import type { IComponent } from '$/web/shared/component';
import type { PropsWithChildren } from 'react';

export type Props = PropsWithChildren<PageProps>;
export type ILayoutComponent = IComponent<Props>;
