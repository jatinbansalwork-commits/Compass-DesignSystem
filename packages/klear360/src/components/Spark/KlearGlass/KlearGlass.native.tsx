import type { KlearGlassProps } from './types';
import { throwKlear360Error } from '~utils/logger';
import { Text } from '~components/Typography';

const KlearGlass = (_props: KlearGlassProps): React.ReactElement => {
  throwKlear360Error({
    message: 'Klearsense is not yet implemented for React Native',
    moduleName: 'Klearsense',
  });

  return <Text>Klearsense Component is not available for Native mobile apps.</Text>;
};

export { KlearGlass };
