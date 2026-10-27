import { getDividerMarginTokens } from '../tokens';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';
import { useTheme } from '~utils';

const MenuDivider = (styledProps: StyledPropsCompass): React.ReactElement => {
  const { theme } = useTheme();
  return <Divider {...getDividerMarginTokens(theme)} {...styledProps} />;
};

export { MenuDivider };
