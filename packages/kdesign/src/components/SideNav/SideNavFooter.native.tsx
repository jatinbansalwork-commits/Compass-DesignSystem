import type { SideNavFooterProps } from './types';
import { Text } from '~components/Typography';
import { throwKdesignError } from '~utils/logger';

const SideNavFooter = (_props: SideNavFooterProps): React.ReactElement => {
  throwKdesignError({
    message: 'SideNavFooter is not yet implemented for native',
    moduleName: 'SideNavFooter',
  });

  return <Text>SideNavFooter Component is not available for Native mobile apps.</Text>;
};

export { SideNavFooter };
