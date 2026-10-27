import type { MenuHeaderProps, MenuFooterProps } from '../types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const MenuHeader = (_props: MenuHeaderProps): React.ReactElement => {
  throwCompassError({
    message: 'MenuHeader is not yet implemented for native',
    moduleName: 'MenuHeader',
  });

  return <Text>MenuHeader Component is not available for Native mobile apps.</Text>;
};

const MenuFooter = (_props: MenuFooterProps): React.ReactElement => {
  throwCompassError({
    message: 'MenuFooter is not yet implemented for native',
    moduleName: 'MenuFooter',
  });

  return <Text>MenuFooter Component is not available for Native mobile apps.</Text>;
};

export { MenuHeader, MenuFooter };
