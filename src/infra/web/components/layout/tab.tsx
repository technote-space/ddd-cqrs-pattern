import type { PropsWithChildren, ReactElement } from 'react';
import type { TabViewProps } from 'react-native-tab-view';
import type { NavigationState } from 'react-native-tab-view/lib/typescript/types';
import { Box, Pressable } from 'native-base';
import { useCallback, useMemo, useState, memo } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import Heading from '#/text/heading';

type TabItemProps = {
  key: string;
  title: string;
};

const TabItem = memo(({ children }: PropsWithChildren<TabItemProps>) => {
  return <Box alignItems="center">{children}</Box>;
});
TabItem.displayName = 'TabItem';
export { TabItem };

const Tabs = ({ children }: { children: ReactElement<TabItemProps>[] }) => {
  const [index, setIndex] = useState(0);
  const renderScene = useMemo(() => SceneMap(Object.assign({}, ...children.map(item => ({
    [item.key as string]: () => item,
  })))), [children]);
  const routes = useMemo(() => children.map(item => ({
    key: item.key as string,
    title: item.props.title,
    element: item,
  })), [children]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTabBar: TabViewProps<any>['renderTabBar'] = useCallback((props: { navigationState: NavigationState<any> }) => {
    return <Box flexDirection="row">
      {props.navigationState.routes.map((route: { title: string; element: ReactElement<TabItemProps> }, i: number) => {
        const borderColor = index === i ? 'cyan.500' : 'coolGray.200';
        const handlePress = useCallback(() => {
          setIndex(i);
        }, [i]);

        return <Pressable
          key={i}
          onPress={handlePress}
          style={{ display: 'flex', flex: 1 }}
          _hover={{ opacity: 0.6 }}
        >
          <Box
            borderBottomWidth="3"
            borderColor={borderColor}
            flexGrow={1}
            alignItems="center"
            p="3"
            cursor="pointer"
          >
            <Heading size="md">{route.title}</Heading>
          </Box>
        </Pressable>;
      })}
    </Box>;
  }, [index]);

  return <TabView
    navigationState={{ index, routes }}
    renderScene={renderScene}
    renderTabBar={renderTabBar}
    onIndexChange={setIndex}
    style={{ width: '100%' }}
  />;
};

Tabs.displayName = 'Tabs';
export default memo(Tabs);
