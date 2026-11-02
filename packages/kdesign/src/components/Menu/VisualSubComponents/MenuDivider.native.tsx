import type { StyledPropsKdesign } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { throwKdesignError } from '~utils/logger';

const MenuDivider = (_styledProps: StyledPropsKdesign): React.ReactElement => {
  throwKdesignError({
    message: 'MenuDivider is not yet implemented for native',
    moduleName: 'MenuDivider',
  });

  return <Text>MenuDivider Component is not available for Native mobile apps.</Text>;
};

export { MenuDivider };
