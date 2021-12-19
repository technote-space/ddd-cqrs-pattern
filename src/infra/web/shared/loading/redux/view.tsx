import type { VFC } from 'react';
import { memo } from 'react';
import Loading from '@/web/components/loading';
import Modal from '@/web/components/modal';

type Props = {
  isLoading: boolean;
  messages?: string[];
};
const View: VFC<Props> = ({ isLoading, messages }) => {
  return <Modal isOpen={isLoading}>
    <Modal.Content>
      <Modal.Body>
        {messages?.map((message, index) => <Loading key={index} message={message}/>)}
        {!messages?.length && <Loading message="Loading..."/>}
      </Modal.Body>
    </Modal.Content>
  </Modal>;
};
View.displayName = 'LoadingView';

export default memo(View);
