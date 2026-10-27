import type { SideNavFooterProps } from './types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const SideNavFooter = (_props: SideNavFooterProps): React.ReactElement => {
  throwCompassError({
    message: 'SideNavFooter is not yet implemented for native',
    moduleName: 'SideNavFooter',
  });

  return <Text>SideNavFooter Component is not available for Native mobile apps.</Text>;
};

export { SideNavFooter };
