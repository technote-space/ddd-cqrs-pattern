import type { HooksParams } from './hooks';
import type { VFC } from 'react';
import { memo } from 'react';

const View: VFC<HooksParams> = ({ user }) => {
  if (!user.isLoggedIn) {
    return <div>Redirecting...</div>;
  }

  return <div>
    Hello World!
  </div>;
};

View.displayName = 'IndexView';
export default memo(View);
