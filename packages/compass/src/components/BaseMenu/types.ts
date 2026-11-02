import type { LinkProps } from '~components/Link';
import type { CompassCommonEvents } from '~components/types';
import type { Platform } from '~utils';
import type { DataAnalyticsAttribute } from '~utils/types';

type BaseMenuItemProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /** Root element for the item (link, button, or custom component). */
  as?: React.ComponentType<any> | 'a' | 'button';
  /** Stable id for the item (selection / aria). */
  id?: string;
  /** Primary label text. */
  title?: string;
  /** Secondary description under the title. */
  description?: string;
  /** Custom content instead of title/description. */
  children?: React.ReactNode;
  /** Optional className on the item root. */
  className?: string;
  /** Disables interaction and dims the item. */
  isDisabled?: boolean;
  /** Selected state for single/multi select menus. */
  isSelected?: boolean;
  /** When false, item is hidden (e.g. filtered out). */
  isVisible?: boolean;
  /** Keyboard highlight while roving focus is on this item. */
  isKeydownPressed?: boolean;
  /** Slot before title (icon, avatar). */
  leading?: React.ReactNode;
  /** Slot after title (shortcut, badge). */
  trailing?: React.ReactNode;
  /** Inline content after the title on the same row. */
  titleSuffix?: React.ReactNode;
  /** Selection behavior for checkbox-style items. */
  selectionType?: 'single' | 'multiple';
  /** Destructive styling (e.g. delete action). */
  color?: 'negative';
  /** Link href when `as` is anchor-like. */
  href?: LinkProps['href'];
  /** Link target. */
  target?: LinkProps['target'];
  /** Link rel. */
  rel?: LinkProps['rel'];
  /** ARIA role for menu vs listbox patterns. */
  role?: 'menuitem' | 'menuitemcheckbox' | 'option' | 'link';
  /** Tab order when not using roving tabindex. */
  tabIndex?: number;
  onClick?: Platform.Select<{
    web: React.MouseEventHandler;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    native: undefined | ((event: any) => void);
  }>;
} & CompassCommonEvents &
  DataAnalyticsAttribute;

type StyledBaseMenuItemContainerProps = Pick<
  BaseMenuItemProps,
  'color' | 'selectionType' | 'isSelected' | 'isDisabled' | 'isVisible' | 'isKeydownPressed'
>;

type BaseMenuItemContextType = {
  color?: BaseMenuItemProps['color'];
  isDisabled?: BaseMenuItemProps['isDisabled'];
};

export type { BaseMenuItemProps, StyledBaseMenuItemContainerProps, BaseMenuItemContextType };
