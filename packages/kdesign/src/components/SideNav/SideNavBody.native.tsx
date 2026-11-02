import type { SideNavBodyProps } from './types';
import { Text } from '~components/Typography';
import { throwKdesignError } from '~utils/logger';

const SideNavBody = (_props: SideNavBodyProps): React.ReactElement => {
  throwKdesignError({
    message: 'SideNavBody is not yet implemented for native',
    moduleName: 'SideNavBody',
  });

  return <Text>SideNavBody Component is not available for Native mobile apps.</Text>;
};

export { SideNavBody };
