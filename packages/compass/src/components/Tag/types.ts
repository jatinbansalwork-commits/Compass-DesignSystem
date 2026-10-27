import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Optional leading icon shown before the tag label.
   *
   * @default undefined
   */
  icon?: IconComponent;

  /**
   * Called when the user dismisses the tag via the close affordance.
   */
  onDismiss: () => void;

  /**
   * Visible label text inside the tag.
   */
  children: StringChildrenType;

  /**
   * Prevents dismiss and interaction when true.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Private property for Compass.
   *
   * Should not be used by consumers.
   *
   * Used for adding virtual focus on tag.
   *
   * @private
   */
  _isVirtuallyFocused?: boolean;

  /**
   * Private property for Compass.
   *
   * Should not be used by consumers.
   *
   * Is tag placed inside an input
   *
   * @private
   */
  _isTagInsideInput?: boolean;
} & StyledPropsCompass &
  DataAnalyticsAttribute &
  TestID;

type TagsGroupProps = {
  tags: string[];
  activeTagIndex: number;
  isDisabled: TagProps['isDisabled'];
  onDismiss: ({ tagIndex, tagName }: { tagIndex: number; tagName: TagProps['children'] }) => void;
  size?: TagProps['size'];
};

type AnimatedTagProps = {
  children: TagProps['children'];
  isDisabled: TagProps['isDisabled'];
  currentTagIndex: number;
  activeTagIndex: number;
  onDismiss: TagsGroupProps['onDismiss'];
  tagsLength: number;
  size: TagProps['size'];
};

export type { TagProps, AnimatedTagProps, TagsGroupProps };
