import type { VFC } from 'react';

type Props = {
  isLoading: boolean;
};
const View: VFC<Props> = ({ isLoading }) => {
  return <div>
    {isLoading && <div>Loading...</div>}
  </div>;
};
View.displayName = 'LoadingView';

export default View;
