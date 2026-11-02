import React from 'react';
import BaseBox from '~components/Box/BaseBox';

type TopNavBrandLogoPlaceholderProps = {
  /**
   * `onPrimary` — dashed slot on TopNav primary/neutral header.
   * `onSurface` — dashed slot on SideNav / gray workspace surfaces.
   *
   * @default 'onPrimary'
   */
  tone?: 'onPrimary' | 'onSurface';
};

/** Standard brand slot (116×24) for app-provided artwork in Storybook examples. */
const TopNavBrandLogoPlaceholder = ({
  tone = 'onPrimary',
}: TopNavBrandLogoPlaceholderProps): React.ReactElement => {
  const isOnSurface = tone === 'onSurface';

  return (
    <BaseBox
      role="img"
      aria-label="Application logo placeholder"
      width="116px"
      height="24px"
      borderRadius="small"
      borderWidth="thin"
      borderStyle="dashed"
      borderColor={
        isOnSurface ? 'surface.border.gray.muted' : 'interactive.border.staticWhite.faded'
      }
      backgroundColor={
        isOnSurface ? 'surface.background.gray.subtle' : 'interactive.background.staticWhite.faded'
      }
    />
  );
};

export { TopNavBrandLogoPlaceholder };
export type { TopNavBrandLogoPlaceholderProps };
