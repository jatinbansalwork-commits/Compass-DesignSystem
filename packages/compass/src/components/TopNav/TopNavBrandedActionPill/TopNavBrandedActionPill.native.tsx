import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';
import type { TopNavBrandedActionPillProps } from './types';

const TopNavBrandedActionPill = (_props: TopNavBrandedActionPillProps): React.ReactElement => {
  throwCompassError({
    message: 'TopNavBrandedActionPill is not yet implemented for native',
    moduleName: 'TopNavBrandedActionPill',
  });

  return <Text>TopNavBrandedActionPill is not available for Native mobile apps.</Text>;
};

export { TopNavBrandedActionPill };
