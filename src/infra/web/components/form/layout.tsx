import type { FC } from 'react';
import { ScrollView, Flex } from 'native-base';

const FormLayout: FC = ({ children }) => {
  return <ScrollView
    flex={1}
    width="100%"
    p={2}
    showsVerticalScrollIndicator={false}
  >
    <Flex direction="column" m={2}>
      {children}
    </Flex>
  </ScrollView>;
};

FormLayout.displayName = 'FormLayout';
export default FormLayout;
