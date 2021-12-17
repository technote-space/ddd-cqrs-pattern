import type { View as ViewType } from '$/web/components/view';
import { container } from 'tsyringe';

const View: ViewType = (props) => {
  const Component = container.resolve<ViewType>('Components/View');
  return <Component {...props}/>;
};
export default View;
