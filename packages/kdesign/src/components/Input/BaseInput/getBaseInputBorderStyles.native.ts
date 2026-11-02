import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/KdesignProvider';

const getBaseInputBorderStyles = ({
  borderColor,
}: {
  theme: Theme;
  borderWidth: number;
  borderColor: string;
  isFocused?: boolean;
}): CSSObject => ({
  borderColor,
});

export { getBaseInputBorderStyles };
