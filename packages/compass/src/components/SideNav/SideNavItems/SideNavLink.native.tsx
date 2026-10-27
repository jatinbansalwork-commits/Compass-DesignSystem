import type { SideNavLinkProps } from '../types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const SideNavLink = (_props: SideNavLinkProps): React.ReactElement => {
  throwCompassError({
    message: 'SideNavLink is not yet implemented for native',
    moduleName: 'SideNavLink',
  });

  return <Text>SideNavLink Component is not available for Native mobile apps.</Text>;
};

export { SideNavLink };
