import type React from 'react';
import type { DropdownProps } from './types';
import type { ContainerElementType } from '~utils/types';

type OptionsType = {
  title: string;
  value: string;
  onClickTrigger?: (isSelected: boolean) => void;
}[];

/**
 * Controller published by TreeView when it is rendered as Dropdown overlay content.
 *
 * All tree-specific behaviour inside Dropdown is gated on this being present, so
 * ActionList (and any other overlay content) paths stay behaviourally identical
 */
type TreeViewDropdownControllerType = {
  /**
   * Option indices of rows that are currently traversable (not hidden under a collapsed branch).
   * Used for visibility-aware keyboard traversal (same idea as AutoComplete's filteredValues)
   */
  getVisibleOptionIndices: () => number[];
  /**
   * ArrowRight: expand the active collapsed branch, or move to its first child
   */
  onArrowRightKeydown: (activeIndex: number) => void;
  /**
   * ArrowLeft: collapse the active expanded branch, or move to its parent
   */
  onArrowLeftKeydown: (activeIndex: number) => void;
  /**
   * Returns true when the tree handled the selection itself
   * (branch cascade toggle in multiple selection / load-more activation).
   * Returning false falls through to the default selectOption path
   */
  handleOptionSelect: (index: number, properties?: { key?: string }) => boolean;
  /**
   * Values of the topmost fully-selected branches, included in the trigger's onChange payload
   */
  getSelectedGroups: (selectedIndices: number[]) => string[];
  /**
   * Smallest describing set for the trigger display (D5)
   */
  getDisplayOverride: (selectedIndices: number[]) => { label: string; count: number } | undefined;
};

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
  /**
   * contains the indexes of selected items
   */
  selectedIndices: number[];
  setSelectedIndices: (value: number[]) => void;
  /**
   * contains the indexes of selected items during controlled selection
   */
  controlledValueIndices: number[];
  setControlledValueIndices: (value: number[]) => void;
  /**
   * contains information about all the options inside actionlist
   */
  options: OptionsType;
  setOptions: (value: OptionsType) => void;

  /**
   * Filtered values for AutoComplete Inputs
   */
  filteredValues: string[];
  setFilteredValues: (values: string[]) => void;

  /** Currently active (focussed) index  */
  activeIndex: number;
  setActiveIndex: (value: number) => void;

  /** Currently active (focussed) tag  */
  activeTagIndex: number;
  setActiveTagIndex: (value: number) => void;

  /**
   * Sometimes we want to ignore the blur event to keep dropdown open but not ignore the blur animation from selectinput
   * E.g. When someone clicks on Footer, we just want to ignore the blur event and not the blur animation
   */
  shouldIgnoreBlurAnimation: boolean;
  setShouldIgnoreBlurAnimation: (value: boolean) => void;
  /** Tells you if keyboard was used. Its false by default and turns into true when keydown is called  */
  isKeydownPressed: boolean;
  setIsKeydownPressed: (value: boolean) => void;
  /** common baseId which is prepended to multiple other ids inside this dropdown  */
  dropdownBaseId: string;
  /** Which element has triggered the dropdown */
  dropdownTriggerer?:
    | 'SelectInput'
    | 'DropdownButton'
    | 'DropdownIconButton'
    | 'AutoComplete'
    | 'DropdownLink'
    | 'SearchInput'
    | 'FilterChipSelectInput'
    | 'InputDropdownButton';

  /** ref of triggerer. Used to call focus in certain places */
  triggererRef: React.MutableRefObject<HTMLButtonElement | null>;
  headerAutoCompleteRef: React.MutableRefObject<HTMLButtonElement | null>;
  triggererWrapperRef: React.MutableRefObject<ContainerElementType | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
  isTagDismissedRef: React.RefObject<{ value: boolean } | null>;
  visibleTagsCountRef: React.RefObject<{ value: number } | null>;

  selectionType?: DropdownProps['selectionType'];
  /** whether footer has an action item.
   * certain a11y behaviour changes happen here
   * E.g. tabbing moves focus to that action instead of outside
   */
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;

  /**
   * Apart from dropdownTriggerer prop, we also set this boolean because in BottomSheetHeader and DropdownHeader, the trigger can be Select but they can also have autocomplete inside of header
   */
  hasAutoCompleteInHeader: boolean;
  setHasAutoCompleteInHeader: (value: boolean) => void;

  /**
   * A value that can be used in dependency array to know when Dropdown value is changed.
   *
   * E.g.
   * ```ts
   * useEffect(() => {
   *  console.log('Uncontrolled value change');
   * }, [changeCallbackTriggerer])
   * ```
   */
  changeCallbackTriggerer: number;
  setChangeCallbackTriggerer: (changeCallbackTriggerer: number) => void;

  /**
   * true when SelectInput has `value` prop (when it is controlled)
   */
  isControlled: boolean;
  setIsControlled: (isControlled: boolean) => void;

  /**
   * Set by TreeView when it is rendered as the overlay content. null for every other
   * overlay content (ActionList, Menu, custom slots)
   */
  treeViewControllerRef: React.MutableRefObject<TreeViewDropdownControllerType | null>;
};

export type { OptionsType, TreeViewDropdownControllerType, DropdownContextType };
