import type { KlearGlassProps } from './types';
import { throwKdesignError } from '~utils/logger';
import { Text } from '~components/Typography';

const KlearGlass = (_props: KlearGlassProps): React.ReactElement => {
  throwKdesignError({
    message: 'Klearsense is not yet implemented for React Native',
    moduleName: 'Klearsense',
  });

  return <Text>Klearsense Component is not available for Native mobile apps.</Text>;
};

export { KlearGlass };
