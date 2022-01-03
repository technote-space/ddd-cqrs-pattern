import type { IIconButtonProps } from 'native-base';
import type { FC } from 'react';
import { createIcon } from 'native-base';
import { memo } from 'react';
import IconButton from './iconButton';

const UpdateIcon = createIcon({
  viewBox: '0 0 512 512',
  d: 'M497.207,88.4l-73.634-73.607c-19.721-19.712-51.646-19.73-71.375-0.018l-47.733,47.733L71.214,295.812 c-9.671,9.67-17.066,21.341-21.694,34.201L2.243,461.593c-4.93,13.731-1.5,29.064,8.817,39.381 c10.309,10.309,25.66,13.74,39.382,8.8l131.563-47.293c12.86-4.62,24.539-12.032,34.201-21.686L437.011,219.98l0.009,0.009 l12.48-12.498l47.707-47.725l0.017-0.017C516.859,140.046,516.936,108.138,497.207,88.4z M96.175,320.773L327.686,89.219 l41.303,41.303L133.91,365.601l-41.088-41.079C93.899,323.238,94.985,321.962,96.175,320.773z M170.067,429.254l-83.83,30.133 L52.631,425.78l30.124-83.822c0.215-0.612,0.517-1.19,0.749-1.793l88.347,88.338C171.248,428.745,170.67,429.038,170.067,429.254z  M191.244,415.834c-1.19,1.181-2.465,2.275-3.749,3.353l-41.106-41.104l235.08-235.08l41.294,41.294L191.244,415.834z  M472.237,134.814l-35.226,35.235l-1.767,1.767l-95.078-95.078l37.002-37.002c5.913-5.887,15.506-5.895,21.445,0.026l73.625,73.599 c5.922,5.904,5.93,15.498-0.026,21.47L472.237,134.814z',
});

const UpdateButton: FC<IIconButtonProps> = ({
  variant,
  borderRadius,
  alignItems,
  justifyContent,
  alignSelf,
  ...props
}) => {
  return <IconButton
    variant={variant ?? 'solid'}
    borderRadius={borderRadius ?? 'full'}
    alignItems={alignItems ?? 'center'}
    justifyContent={justifyContent ?? 'center'}
    alignSelf={alignSelf ?? 'center'}
    icon={<UpdateIcon/>}
    {...props}
  />;
};

UpdateButton.displayName = 'UpdateButton';
export default memo(UpdateButton);
