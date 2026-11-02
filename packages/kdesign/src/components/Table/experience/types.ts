import type React from 'react';
import type {
  Identifier,
  TableColumnFilterConfig,
  TableData,
  TableNode,
  TablePaginationProps,
  TableProps,
  TableSortOrderEntry,
} from '../types';
import type { TableExperienceFilterMatchMode } from './filterMatchMode';
import type { FilterFieldExtractors } from './wrapFilterFunctionsWithMatchMode';
import type { TableExperienceColumnToggleOption } from './TableExperienceColumnToggle';

/** Prime-style sort direction: `1` asc, `-1` desc. */
type TableExperienceSortOrder = 1 | -1;

type TableExperienceInitialSort = {
  sortKey: string;
  direction: 'asc' | 'desc';
};

type TableExperienceExportColumn<Item> = {
  header: string;
  getValue: (item: TableNode<Item>) => string;
};

type TableExperienceEmptyCopy = {
  noDataTitle?: string;
  noDataDescription?: string;
  noResultsTitle?: string;
  noResultsDescription?: string;
};

type TableExperienceFeatures = {
  /** Client multi-sort via experience layer (Table headers stay sortable; data presorted). Default `true` when `sortFunctions` set. */
  multiSort?: boolean;
  /** Prime-style advanced filter popover + match modes. Default `false`. */
  advancedFilters?: boolean;
  /** Column visibility popover in toolbar. Default `false`. */
  columnToggle?: boolean;
  /** Ctrl/Cmd+click and Shift+click range selection. Default `false`. */
  metaKeySelection?: boolean;
  /** Drag handles on header cells + `gridTemplateColumns` from layout state. Default `false`. */
  columnResize?: boolean;
  /** Toolbar reorder popover; render headers/cells in `experienceOrderedVisibleColumnKeys`. Default `false`. */
  columnReorder?: boolean;
  /** Arrow keys + Space on rows (focus the table shell first). Default `false`. */
  rowKeyboardNavigation?: boolean;
  /** Hide inline header filter row when using advanced filters. Default `true` when `advancedFilters`. */
  hideInlineHeaderFiltersWhenAdvanced?: boolean;
};

/**
 * Domain state your app hook owns — same rules as {@link TableProps} (filterFunctions,
 * sortFunctions, server pagination). The experience layer only wires UI; it does not
 * change predicates or fetch logic.
 */
type TableExperienceController<Item> = Pick<
  TableProps<Item>,
  | 'data'
  | 'filterFunctions'
  | 'filterConfig'
  | 'columnFilterValues'
  | 'defaultColumnFilterValues'
  | 'onColumnFilterValuesChange'
  | 'globalFilterValue'
  | 'defaultGlobalFilterValue'
  | 'onGlobalFilterValueChange'
  | 'sortFunctions'
  | 'onSortChange'
  | 'selectionType'
  | 'onSelectionChange'
  | 'defaultSelectedIds'
  | 'isLoading'
  | 'isRefreshing'
> & {
  initialSort?: TableExperienceInitialSort;
  sortField?: string;
  sortOrder?: TableExperienceSortOrder | 0;
};

type UseTableExperienceControllerOptions<Item> = {
  data: TableData<Item>;
  filterFunctions?: TableProps<Item>['filterFunctions'];
  filterConfig?: Record<string, TableColumnFilterConfig>;
  sortFunctions?: TableProps<Item>['sortFunctions'];
  initialSort?: TableExperienceInitialSort;
  defaultGlobalFilterValue?: string;
  defaultColumnFilterValues?: Record<string, string | string[]>;
  defaultSelectedIds?: Identifier[];
  selectionType?: TableProps<Item>['selectionType'];
  features?: TableExperienceFeatures;
  /** Used with advanced filter match modes (text columns). */
  filterFieldExtractors?: FilterFieldExtractors<Item>;
  /** Column metadata for visibility toggle + advanced filters UI. */
  filterableColumns?: TableExperienceColumnToggleOption[];
  /** Extra `grid-template-columns` segments after managed columns (e.g. Amount). */
  gridTrailingTemplateColumns?: string[];
  /** Restored column layout (e.g. from localStorage). */
  initialColumnOrder?: string[];
  initialVisibleColumnKeys?: string[];
  initialColumnWidths?: Record<string, number>;
  /**
   * How many **data** columns at the start of {@link experienceOrderedVisibleColumnKeys} stay
   * frozen on horizontal scroll. Independent of how many columns have header filters.
   *
   * With `selectionType="multiple"`, {@link Table} also freezes the checkbox column — e.g.
   * `stickyLeadingColumnCount={1}` → checkbox + first data column (often Shipment ID).
   *
   * When set with column resize/reorder, leading grid tracks use fixed `px` widths (must match
   * `Table` `stickyColumnWidths`; see {@link buildExperienceStickyLeadingLayout}).
   */
  stickyLeadingColumnCount?: number;
};

type UseTableExperienceControllerReturn<Item> = TableExperienceController<Item> & {
  experienceProps: TableExperienceController<Item> & {
    experienceFeatures: TableExperienceFeatures;
    experienceSortOrder: TableSortOrderEntry[];
    experienceFilterableColumns: TableExperienceColumnToggleOption[];
    experienceFilterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
    experienceVisibleColumnKeys: string[];
    handleExperienceSortChange: (payload: {
      sortKey: string;
      isSortReversed: boolean;
      shiftKey?: boolean;
    }) => void;
    applyAdvancedFilters: (payload: {
      columnFilterValues: Record<string, string | string[]>;
      filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
    }) => void;
    setExperienceVisibleColumnKeys: (keys: string[]) => void;
    setExperienceSelectedIds: (ids: Identifier[]) => void;
    experienceSelectedIds: Identifier[];
    experienceColumnOrder: string[];
    /** Default column order from `filterableColumns` definition order. */
    experienceDefaultColumnOrder: string[];
    setExperienceColumnOrder: (order: string[]) => void;
    experienceColumnWidths: Record<string, number>;
    setExperienceColumnWidth: (columnKey: string, widthPx: number) => void;
    experienceOrderedVisibleColumnKeys: string[];
    experienceGridTemplateColumns: string | undefined;
    /** Same value passed to `useTableExperienceController` (`stickyLeadingColumnCount`). */
    experienceStickyLeadingDataColumnCount: number;
    /** First N keys in column order that participate in the sticky lane. */
    experienceStickyLeadingColumnKeys: string[];
    /** Pass-through for {@link TableProps.stickyColumnCount} when using experience layout. */
    experienceStickyColumnCount: number;
    /** Pass-through for {@link TableProps.stickyColumnWidths}. */
    experienceStickyColumnWidths: string[];
  };
  selectedIds: Identifier[];
  /** Active experience multi-sort (Prime `multiSortMeta` equivalent). */
  multiSortOrder: TableSortOrderEntry[];
  setGlobalFilterValue: (value: string) => void;
  setColumnFilterValues: (values: Record<string, string | string[]>) => void;
  clearFilters: () => void;
  filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
  visibleColumnKeys: string[];
};

type KdesignDataTableProps<Item> = Omit<
  TableProps<Item>,
  'toolbar' | 'data' | 'children' | 'filterFunctions' | 'onSortChange'
> &
  TableExperienceController<Item> & {
    filterFunctions?: TableProps<Item>['filterFunctions'];
    children: TableProps<Item>['children'];
    toolbarTitle?: string;
    toolbarSelectedTitle?: string;
    showGlobalSearch?: boolean;
    searchPlaceholder?: string;
    searchAccessibilityLabel?: string;
    searchVariant?: 'expanded' | 'collapsibleOnHover';
    /** `icon` — icon-only toolbar actions with tooltips (Filters, Columns, …). */
    toolbarActionVariant?: 'labeled' | 'icon';
    /** When true, CSV export uses selected rows when any are selected. @default true */
    exportPreferSelection?: boolean;
    exportColumns?: TableExperienceExportColumn<Item>[];
    exportFileName?: string;
    toolbarActions?: React.ReactNode;
    pagination?: React.ReactElement<TablePaginationProps>;
    emptyCopy?: TableExperienceEmptyCopy;
    /** Phase 2 wiring from {@link useTableExperienceController}. */
    experienceApi?: UseTableExperienceControllerReturn<Item>['experienceProps'];
    onSortChange?: TableProps<Item>['onSortChange'];
  };

type TableExperienceEmptyReason = 'no-data' | 'no-results';

export type {
  TableExperienceSortOrder,
  TableExperienceInitialSort,
  TableExperienceExportColumn,
  TableExperienceEmptyCopy,
  TableExperienceController,
  TableExperienceFeatures,
  UseTableExperienceControllerOptions,
  UseTableExperienceControllerReturn,
  KdesignDataTableProps,
  TableExperienceEmptyReason,
  TableExperienceColumnToggleOption,
};
