import type { StyledPropsCompass } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const MenuDivider = (_styledProps: StyledPropsCompass): React.ReactElement => {
  throwCompassError({
    message: 'MenuDivider is not yet implemented for native',
    moduleName: 'MenuDivider',
  });

  return <Text>MenuDivider Component is not available for Native mobile apps.</Text>;
};

export { MenuDivider };
