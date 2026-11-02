import { Text } from '~components/Typography';
import { throwKdesignError } from '~utils/logger';
import type { TopNavBrandedActionPillProps } from './types';

const TopNavBrandedActionPill = (_props: TopNavBrandedActionPillProps): React.ReactElement => {
  throwKdesignError({
    message: 'TopNavBrandedActionPill is not yet implemented for native',
    moduleName: 'TopNavBrandedActionPill',
  });

  return <Text>TopNavBrandedActionPill is not available for Native mobile apps.</Text>;
};

export { TopNavBrandedActionPill };
