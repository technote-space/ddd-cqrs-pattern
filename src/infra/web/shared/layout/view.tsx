import type { FC } from 'react';

const View: FC = ({ children }) => {
  return <main>
    <div>
      {children}
    </div>
  </main>;
};
View.displayName = 'LayoutView';

export default View;
