import type { ScreenProps } from '$/web/pages';
import type { VFC } from 'react';
import { memo } from 'react';

const View: VFC<ScreenProps> = () => <div>
  Hello World!
</div>;

View.displayName = 'HomeView';
export default memo(View);
