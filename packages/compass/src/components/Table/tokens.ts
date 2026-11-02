import { AlertCircleIcon, CheckIcon } from '~components/Icons';
import { size } from '~tokens/global';

const firstColumnStickyZIndex = 2;
const stickyHeaderColumnZIndex = 4;

const refreshWrapperZIndex = 3;

const checkboxCellWidth = size['44'];

const tableBackgroundColor = 'surface.background.gray.intense';
const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'surface.background.gray.moderate',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
  backgroundColor: 'interactive.background.gray.faded',
} as const;

const tableRow = {
  paddingLeft: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  paddingRight: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  minHeight: {
    compact: '36',
    normal: '48',
    comfortable: '60',
  },
  nonStripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    // TODO: Rebranding - on design side: explore pressed state color change, right now both hover & active are same
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  nonStripeWrapper: {
    // not used anywhere
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'transparent',
    backgroundColorSelectedHover: 'transparent',
    backgroundColorSelectedFocus: 'transparent',
    backgroundColorSelectedActive: 'transparent',
  },
  stripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  stripeWrapper: {
    backgroundColor: 'interactive.background.gray.default',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.default',
    backgroundColorSelectedHover: 'interactive.background.gray.default',
    backgroundColorSelectedFocus: 'interactive.background.gray.default',
    backgroundColorSelectedActive: 'interactive.background.gray.default',
  },
  borderBottomWidth: 'thin',
  borderColor: 'surface.border.gray.muted',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  groupHeaderBackgroundColor: 'surface.background.gray.moderate',
} as const;

/** Outer height (borders included) of one compact header band row — label, filter, or toolbar. */
const compactHeaderBandRowHeight = size[tableRow.minHeight.compact];

/** Icon / button sizes for table chrome (toolbar, header, row hover). */
const tableIcons = {
  /** Toolbar search, Filters/Columns/Export, header filter clear, header info — 32px control height. */
  control: 'small',
  /** Trailing row hover rail ghost icons. */
  rowHover: 'small',
  /** Trailing row hover text actions (e.g. “View entry”). */
  rowHoverTextButton: 'xsmall',
} as const;

/** Label + filter header band (always compact — see `TableHeaderRow`). */
const tableHeaderBand = {
  cellPaddingX: 'spacing.3',
  /** Horizontal inset for flush filter inputs inside header cells. */
  filterCellInsetX: 'spacing.2',
  /** Space between column label and sort control. */
  sortIconGap: 'spacing.2',
  /** Title ↔ info icon in column headers with tooltips. */
  titleInfoGap: 'spacing.1',
  sortIconSizePx: size['20'],
  /** Sort hit-area padding (pairs with negative margin on {@link SortButton}). */
  sortHitAreaPadding: 'spacing.1',
} as const;

/** Trailing hover-actions column (desktop overlay). */
const tableHoverActions = {
  gap: 'spacing.2',
  paddingLeft: { base: 'spacing.3', m: 'spacing.5' },
  paddingRight: 'spacing.3',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.faded',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  minHeight: compactHeaderBandRowHeight,
  /** Vertical `spacing.2` + `size="small"` (32px) controls ≈ 36px band height; horizontal matches header cells. */
  padding: [
    'spacing.2',
    tableHeaderBand.cellPaddingX,
    'spacing.2',
    tableHeaderBand.cellPaddingX,
  ],
  titleBlockGap: 'spacing.3',
  actionsGap: 'spacing.2',
  childActionsGap: 'spacing.2',
  /** Global search in toolbar — fixed width so Filters/Columns stay on the same row. */
  searchMinWidth: size[200],
  searchDefaultWidth: size[240],
  searchMaxWidth: size[264],
  searchCollapsibleMinWidth: size[240],
  searchCollapsibleMaxWidth: size[360],
} as const;

const tablePagination = {
  defaultPageSize: 10,
  backgroundColor: 'surface.background.gray.moderate',
} as const;

const tableEditableCellRowDensityToInputSizeMap = {
  compact: 'small',
  normal: 'medium',
  comfortable: 'large',
} as const;

const validationStateToInputTrailingIconMap = {
  none: undefined,
  success: CheckIcon,
  error: AlertCircleIcon,
};

const rowDensityToIsTableInputCellMapping = {
  comfortable: false,
  normal: true,
  compact: true,
};

const classes = {
  HOVER_ACTIONS: 'hover-actions',
  HOVER_ACTIONS_LAYER2: 'hover-actions-layer-2',
  HOVER_ACTIONS_LAYER3: 'hover-actions-layer-3',
  HAS_ROW_SPANNING: 'has-row-spanning',
  /** Header label + filter rows — vertical z-index owned by `TableHeader.web.tsx`, not theme. */
  HEADER_BAND_CELL: 'header-band-cell',
};

/**
 * @table-library sets `display: contents` on thead/tbody/tfoot/tr, which flattens the a11y tree
 * and breaks `aria-required-parent`. Subgrid rows restore row → cell hierarchy without changing
 * column tracks on the root table grid.
 *
 * Do not apply on virtualized tables: {@link @table-library}'s virtualized body uses
 * `tbody > div { display: block }` as the scrollport; forcing `tbody { display: grid }` breaks scrolling.
 */
const tableA11yRestoreRowHierarchyCSS = `
  & thead,
  & tbody,
  & tfoot {
    display: grid !important;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
  & tr {
    display: grid !important;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
`;

export {
  tableHeader,
  tableFooter,
  tableRow,
  tableIcons,
  tableHeaderBand,
  tableHoverActions,
  tableToolbar,
  compactHeaderBandRowHeight,
  tablePagination,
  refreshWrapperZIndex,
  tableBackgroundColor,
  firstColumnStickyZIndex,
  stickyHeaderColumnZIndex,
  checkboxCellWidth,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
  rowDensityToIsTableInputCellMapping,
  classes,
  tableA11yRestoreRowHierarchyCSS,
};
