import { container } from 'tsyringe';
import Heading from '@/web/components/nativeBase/heading';
import Text from '@/web/components/nativeBase/text';
import View from '@/web/components/nativeBase/view';

container.registerInstance('Components/View', View);
container.registerInstance('Components/Text', Text);
container.registerInstance('Components/Heading', Heading);
