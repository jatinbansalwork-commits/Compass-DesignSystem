import type { MenuOverlayProps } from './types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const MenuOverlay = (_props: MenuOverlayProps): React.ReactElement => {
  throwCompassError({
    message: 'MenuOverlay is not yet implemented for native',
    moduleName: 'MenuOverlay',
  });

  return <Text>MenuOverlay Component is not available for Native mobile apps.</Text>;
};

export { MenuOverlay };
