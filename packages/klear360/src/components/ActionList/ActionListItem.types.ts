import type React from 'react';
import type { TouchableOpacity } from 'react-native';
import type { FeedbackColors } from '~tokens/theme/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { Platform } from '~utils';

export type ActionListItemProps = {
  /**
   * Primary label for the row, shown as the main line of text.
   */
  title: string;
  /**
   * Supporting detail rendered below the title when space allows.
   *
   * @default undefined
   */
  description?: string;
  /**
   * Handler when the row is activated (ignored when `href` is used for navigation).
   *
   * @default undefined
   */
  onClick?: (clickProps: {
    name: string;
    value?: boolean;
    event: Platform.Select<{
      web: React.MouseEvent;
      native: React.TouchEvent<TouchableOpacity>;
    }>;
  }) => void;
  /**
   * value that you get from `onChange` event on SelectInput or in form submissions.
   */
  value: string;
  /**
   * Link to open when item is clicked.
   */
  href?: string;
  /**
   * HTML target of the link
   */
  target?: string;
  /**
   * Item that goes on left-side of item.
   *
   * Valid elements - `<ActionListItemIcon />`, `<ActionListItemAsset />`
   *
   * Will be overriden in multiselect
   */
  leading?: React.ReactNode;
  /**
   * Item that goes on right-side of item.
   *
   * Valid elements - `<ActionListItemText />`, `<ActionListItemIcon />`
   */
  trailing?: React.ReactNode;
  /**
   * Item that goes immediately next to the title.
   *
   * Valid elements - `<ActionListItemBadge />`, `<ActionListItemBadgeGroup />`
   *
   */
  titleSuffix?: React.ReactElement;
  /**
   * Prevents selection and dims the row when true.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Applies destructive (negative) emphasis to the row for dangerous actions.
   *
   * @default undefined
   */
  intent?: Extract<FeedbackColors, 'negative'>;
  /**
   * Can be used in combination of `onClick` to highlight item as selected in Button Triggers.
   *
   * When trigger is SelectInput, Use `value` prop on SelectInput instead to make dropdown controlled.
   */
  isSelected?: boolean;
  /**
   * Internally passed from ActionList. No need to pass it explicitly
   *
   * @private
   */
  _index?: number;
  /**
   * Internally used to pass index for virtualized lists
   *
   * @private
   */
  _virtualizedIndex?: number;
  /**
   * Internally used to focus on virtualized list
   *
   * @private
   */
  _onVirtualizedFocus?: (_virtuazedIndex: number) => void;
} & TestID &
  DataAnalyticsAttribute;
