import { throwKlear360Error } from '~utils/logger';
import { Text } from '~components/Typography';

// Inline the type to avoid importing the web-only FluidGradient module
export interface FluidGradientProps {
  children?: React.ReactNode;
  size?: number;
  viewBox?: string;
  origin?: [number, number];
}

const FluidGradient = (_props: FluidGradientProps): React.ReactElement => {
  throwKlear360Error({
    message: 'KlearsenseGradient is not yet implemented for React Native',
    moduleName: 'KlearsenseGradient',
  });

  return <Text>KlearsenseGradient Component is not available for Native mobile apps.</Text>;
};

export { FluidGradient };
