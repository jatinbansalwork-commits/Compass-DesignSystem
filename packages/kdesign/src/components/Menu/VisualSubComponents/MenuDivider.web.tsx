import { getDividerMarginTokens } from '../tokens';
import type { StyledPropsKdesign } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';
import { useTheme } from '~utils';

const MenuDivider = (styledProps: StyledPropsKdesign): React.ReactElement => {
  const { theme } = useTheme();
  return <Divider {...getDividerMarginTokens(theme)} {...styledProps} />;
};

export { MenuDivider };
