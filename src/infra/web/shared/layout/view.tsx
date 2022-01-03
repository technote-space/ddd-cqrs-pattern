import type { HooksParams } from './hooks';
import type { FC } from 'react';
import ButtonGroup from '#/button/group';
import LogoutButton from '#/button/logoutButton';
import ToggleDarkModeButton from '#/button/toggleDarkModeButton';
import Flex from '#/layout/flex';

const View: FC<HooksParams> = ({ children, onLogout, isDarkMode, toggleColorMode }) => {
  return <main>
    <Flex maxW={800} mx="auto">
      <ButtonGroup ml="auto">
        <LogoutButton onPress={onLogout}/>
        <ToggleDarkModeButton isDarkMode={isDarkMode} toggleColorMode={toggleColorMode}/>
      </ButtonGroup>
      {children}
    </Flex>
  </main>;
};
View.displayName = 'LayoutView';

export default View;
