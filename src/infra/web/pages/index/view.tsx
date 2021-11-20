import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo } from 'react';

const View: VFC<HooksParams> = () => <div>
  Hello World!
</div>;

View.displayName = 'IndexView';
export default memo(View);
