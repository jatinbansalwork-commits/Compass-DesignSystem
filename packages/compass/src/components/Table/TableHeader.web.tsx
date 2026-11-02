import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/extensions -- @table-library/react-table-library's package.json "exports" map requires the explicit .js extension on this subpath
import { Header, HeaderRow, HeaderCell } from '@table-library/react-table-library/table';
import {
  TABLE_HEADER_COMPACT_ROW_HEIGHT_PX,
  getFilterRowStickyTopOffsetPx,
} from './headerLayoutConstants';
import {
  checkboxCellWidth,
  tableHeader,
  tableHeaderBand,
  tableIcons,
  tableRow,
  classes,
  stickyHeaderColumnZIndex,
} from './tokens';
import { tableHeaderPresentationCellA11yProps } from './tableHeaderPresentationCellA11y';
import { useTableRowContext, useTableDataContext } from './TableContext';
import { ComponentIds } from './componentIds';
import type {
  TableHeaderRowProps,
  TableHeaderCellProps,
  TableBackgroundColors,
  TableProps,
  TableToolbarPlacement,
  TableColumnFilterConfig,
} from './types';
import type { CheckboxProps } from '~components/Checkbox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { castWebType, makeMotionTime, makeSize, makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId } from '~utils/isValidAllowedChildren';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/CompassProvider';
import getIn from '~utils/lodashButBetter/get';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { size } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { BaseInput } from '~components/Input/BaseInput';
import { CloseIcon, SearchIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { VisuallyHidden } from '~components/VisuallyHidden';

const SortButton = styled.button(({ theme }) => ({
  cursor: 'pointer',
  border: 'none',
  // Grows the 20px icon's hit area to 24x24 (WCAG 2.2 SC 2.5.8 Target Size) - the matching
  // negative margin cancels it out in layout, so the icon, the label beside it and the header
  // row height stay exactly where they were. The focus ring (an outline on this button) wraps
  // the full hit area.
  padding: makeSpace(getIn(theme, tableHeaderBand.sortHitAreaPadding)),
  margin: `-${makeSpace(getIn(theme, tableHeaderBand.sortHitAreaPadding))}`,
  borderRadius: theme.border.radius.small,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: makeSpace(theme.spacing[1]),
  transitionProperty: 'color, box-shadow',
  transitionDuration: castWebType(makeMotionTime(getIn(theme.motion, 'duration.quick'))),
  transitionTimingFunction: (theme.motion.easing.standard as unknown) as string,
  '&:focus-visible': getFocusRingStyles({ theme }),
}));

const PriorityBadge = styled(BaseBox)(({ theme }) => ({
  minWidth: makeSize(14),
  height: makeSize(14),
  borderRadius: theme.border.radius.round,
  backgroundColor: getIn(theme.colors, 'interactive.background.gray.faded'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: makeSpace(theme.spacing[1]),
  paddingRight: makeSpace(theme.spacing[1]),
}));

/**
 * `sortDirection` is this column's own state - 'none' is the unsorted state, distinct from
 * 'asc'/'desc' (previously implied only by both arrows being muted). `priority` is this
 * column's 1-based rank when it's part of a multi-column sort (2+ active keys) - omit it
 * (or pass a falsy value) to keep the single-sort look unchanged.
 */
const SortIcon = ({
  sortDirection,
  priority,
}: {
  sortDirection: 'asc' | 'desc' | 'none';
  priority?: number;
}): React.ReactElement => {
  const { theme } = useTheme();
  const defaultColor = getIn(theme.colors, 'interactive.icon.gray.disabled');
  const activeColor = getIn(theme.colors, 'interactive.icon.gray.muted');
  // Preserves the existing mapping: descending highlights the up arrow, ascending the down arrow.
  const upArrowColor = sortDirection === 'desc' ? activeColor : defaultColor;
  const downArrowColor = sortDirection === 'asc' ? activeColor : defaultColor;
  return (
    <SortButton
      {...metaAttribute({ name: MetaConstants.TableSortButton })}
      {...makeAccessible({ label: 'Toggle Sort' })}
    >
      <svg width={tableHeaderBand.sortIconSizePx} height={tableHeaderBand.sortIconSizePx} fill="none">
        <path
          fill={upArrowColor}
          d="M10.59 2.251a.817.817 0 0 0-1.18 0L5.245 6.537a.875.875 0 0 0 0 1.212.817.817 0 0 0 1.179 0L10 4.069l3.577 3.68a.817.817 0 0 0 1.179 0 .874.874 0 0 0 0-1.212L10.589 2.25Z"
        />
        <path
          fill={downArrowColor}
          d="M9.41 17.749a.817.817 0 0 0 1.18 0l4.166-4.286a.874.874 0 0 0 0-1.212.817.817 0 0 0-1.179 0L10 15.931l-3.577-3.68a.817.817 0 0 0-1.179 0 .874.874 0 0 0 0 1.212l4.167 4.286Z"
        />
      </svg>
      {priority ? (
        <PriorityBadge>
          <Text size="small" color="surface.text.gray.muted">
            {priority}
          </Text>
        </PriorityBadge>
      ) : null}
    </SortButton>
  );
};

const StyledHeader = styled(Header)<{
  $tableToolbarPlacement: TableToolbarPlacement;
  $headerFilterGridRowCount?: number;
}>(
  ({ $tableToolbarPlacement, $headerFilterGridRowCount }) => ({
    '&&&': {
      '& tr:first-child th': {
        borderTop: 'none',
      },
      display: $tableToolbarPlacement === 'overlay' ? 'none' : undefined,
      ...($headerFilterGridRowCount != null
        ? {
            rowGap: 0,
            gridRowGap: 0,
            gridTemplateRows: `repeat(${$headerFilterGridRowCount}, ${TABLE_HEADER_COMPACT_ROW_HEIGHT_PX}px)`,
          }
        : {}),
    },
  }),
);

const StyledFilterHeaderCell = styled(HeaderCell)<{
  $backgroundColor: TableBackgroundColors;
  $stickyTopOffsetPx?: number;
  $showBorderedCells?: boolean;
  /** Required for filter band row — @table-library does not map `gridRowStart` to CSS `grid-row`. */
  $gridRow?: string;
}>(({ theme, $backgroundColor, $stickyTopOffsetPx, $showBorderedCells, $gridRow }) => ({
  '&&&': {
    gridRow: $gridRow,
    // When any column is filterable the whole filter band sticks below the label row(s) — including
    // empty spacer cells so the row reads as one unit on vertical scroll (not just inputs).
    boxSizing: 'border-box',
    height: makeSize(TABLE_HEADER_COMPACT_ROW_HEIGHT_PX),
    minHeight: makeSize(TABLE_HEADER_COMPACT_ROW_HEIGHT_PX),
    maxHeight: makeSize(TABLE_HEADER_COMPACT_ROW_HEIGHT_PX),
    ...($stickyTopOffsetPx != null
      ? {
          position: 'sticky',
          // Win over Table theme HeaderCell `top: 0` so this band sticks below label row(s).
          top: `${$stickyTopOffsetPx}px !important`,
          // Below horizontal sticky header cells (theme) so scrolled filters slide under the
          // frozen lane instead of painting on top of it.
          zIndex: stickyHeaderColumnZIndex - 1,
        }
      : {}),
    display: 'flex',
    alignItems: 'center',
    // Stretch to the grid row height so empty spacer cells share the same bottom border as
    // filter inputs (alignSelf: start left shorter empty cells misaligned — see filter row).
    alignSelf: 'stretch',
    minWidth: 0,
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
    borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
    borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
    borderBottomStyle: 'solid',
    ...($showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
        }
      : {}),
    // No horizontal cell padding here - the input already carries its own inset (see the
    // `marginX` on its wrapping BaseBox below), matching TableEditableCell's flush-cell
    // convention. Padding on both would stack (previously 12px cell + 12px icon-slot padding
    // = 24px before the icon, noticeably more than TableEditableCell's 16px).
    paddingLeft: 0,
    paddingRight: 0,
    // Flush to the label row above — vertical padding here stacked with the label border and
    // read as an empty band between "Importer" and the Search control.
    paddingTop: 0,
    paddingBottom: 0,
    // The input itself renders flush/borderless (`isTableInputCell`) same as TableEditableCell,
    // so the cell - not the input - is what shows the focus ring while typing/clearing.
    '&:focus-within': getFocusRingStyles({ theme, negativeOffset: true }),
    '& > div': {
      minWidth: 0,
      width: '100%',
    },
    '& input': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    // SelectInput / dropdown triggers in the filter band share the same truncation rules.
    '& [data-compass-component="styled-base-input-wrapper"]': {
      minWidth: 0,
    },
    '& [data-compass-component="styled-base-input-wrapper"] input': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
}));

const StyledHeaderRow = styled(HeaderRow)<{
  $showBorderedCells: boolean;
  $gridTemplateColumns: string | undefined;
  $hasHoverActions: boolean;
  $selectionType: TableProps<unknown>['selectionType'];
  $columnCount: number;
  $isVirtualized?: boolean;
}>(
  ({
    theme,
    $showBorderedCells,
    $gridTemplateColumns,
    $hasHoverActions,
    $selectionType,
    $columnCount,
    $isVirtualized,
  }) => ({
    '& th': $showBorderedCells
      ? {
          borderRightWidth: makeSpace(getIn(theme.border.width, tableRow.borderBottomWidth)),
          borderRightColor: getIn(theme.colors, tableRow.borderColor),
          borderRightStyle: 'solid',
          ...($isVirtualized && {
            display: 'grid',
            // !important: must win over @table-library's own grid-template-columns regardless of
            // which branch computed the value, matching the same override in Table.web.tsx.
            gridTemplateColumns: `${
              $gridTemplateColumns
                ? `${$gridTemplateColumns} ${$hasHoverActions ? 'min-content' : ''}`
                : ` ${
                    $selectionType === 'multiple' ? 'min-content' : ''
                  } repeat(${$columnCount},minmax(100px, 1fr)) ${
                    $hasHoverActions ? 'min-content' : ''
                  }`
            } !important`,
          }),
        }
      : undefined,
    '& th:last-child ': {
      borderRight: 'none',
    },
  }),
);

/**
 * A column's `headerKey` + rendered label, extracted from the real header row's
 * `TableHeaderCell` children (in order) - so the filter row below can render matching cells
 * without the consumer having to declare the column list a second time.
 *
 * `headerRow` may contain more than one `TableHeaderRow` (grouped multi-row headers) - the LAST
 * one is always the leaf/column row that lines up 1:1 with body columns, so that's the one used
 * here (see `getTableHeaderCellCount` in `Table.web.tsx` for the same convention).
 */
const humanizeHeaderKey = (headerKey: string): string =>
  headerKey
    .split('_')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(' ');

/** Header labels are often compositional (resize handles, info icons) — flatten for a11y only. */
const getTableHeaderFilterLabelText = (
  label: React.ReactNode,
  headerKey?: string,
): string => {
  if (typeof label === 'string' && label.trim()) {
    return label.trim();
  }
  if (typeof label === 'number') {
    return String(label);
  }
  if (Array.isArray(label)) {
    const parts = label
      .map((child) => getTableHeaderFilterLabelText(child, headerKey))
      .filter(Boolean);
    if (parts.length > 0) {
      return parts.join(' ');
    }
  }
  if (React.isValidElement(label)) {
    const childLabel = getTableHeaderFilterLabelText(
      (label.props as { children?: React.ReactNode }).children,
      headerKey,
    );
    if (childLabel) {
      return childLabel;
    }
  }
  if (headerKey) {
    return humanizeHeaderKey(headerKey);
  }
  return 'column';
};

/** Column title sits in the row above — keep filter ghosts short so they truncate cleanly. */
const getTableHeaderFilterTextPlaceholder = (_labelText: string): string => 'Search';

const getTableHeaderFilterPickerPlaceholder = (
  _labelText: string,
  type: TableColumnFilterConfig['type'],
): string => (type === 'multiselect' ? 'Any' : 'All');

const getHeaderCellsMeta = (
  headerRow: React.ReactNode,
): { headerKey?: string; label: React.ReactNode }[] => {
  const headerRowElements = React.Children.toArray(headerRow).filter(
    (child) => getComponentId(child) === ComponentIds.TableHeaderRow,
  );
  const leafHeaderRowElement = headerRowElements[headerRowElements.length - 1];
  if (!React.isValidElement(leafHeaderRowElement)) return [];
  return React.Children.toArray((leafHeaderRowElement.props as TableHeaderRowProps).children)
    .filter((cell) => getComponentId(cell) === ComponentIds.TableHeaderCell)
    .map((cell) => {
      const cellProps = (React.isValidElement(cell) ? cell.props : {}) as TableHeaderCellProps;
      return { headerKey: cellProps.headerKey, label: cellProps.children };
    });
};

/**
 * Renders a filterable column's dropdown/multiselect picker (see `TableProps['filterConfig']`),
 * in place of the default text input - same composition `TableEditableDropdownCell` already uses
 * for body cells (`Dropdown` + `DropdownOverlay` + `ActionList`), just driven by the column's
 * `filterConfig.options` instead of consumer-authored `ActionListItem`s, and controlled by the
 * filter row's own `columnFilterValues` state instead of being uncontrolled.
 *
 * `isTableInputCell` matches this to its plain-text sibling below (`BaseInput isTableInputCell`) -
 * same borderless, cell-edge-flush look - rather than `SelectInput`'s normal bordered, button-like
 * appearance, which read as visually inconsistent sitting next to a plain search box in the same
 * filter row.
 *
 * Unlike that text filter, there's deliberately no leading `SearchIcon` here: this is a picker,
 * not a search - the trailing chevron already says "choose from a list", and a search icon
 * suggested you could type to search instead.
 */
const TableHeaderFilterDropdownCell = ({
  headerKey,
  config,
  value,
  labelText,
  onChange,
}: {
  headerKey: string;
  config: TableColumnFilterConfig;
  value: string | string[] | undefined;
  labelText: string;
  onChange: (value: string | string[]) => void;
}): React.ReactElement => {
  const isMultiselect = config.type === 'multiselect';
  const filterInputId = `table-header-filter-${headerKey}`;
  const filterLabelText = `Filter by ${labelText}`;
  return (
    <BaseBox flex={1} marginX={tableHeaderBand.filterCellInsetX} minWidth="0px" width="100%">
      <VisuallyHidden>
        <label htmlFor={filterInputId}>{filterLabelText}</label>
      </VisuallyHidden>
      <Dropdown selectionType={isMultiselect ? 'multiple' : 'single'} _width="100%">
        <SelectInput
          id={filterInputId}
          testID={filterInputId}
          size="small"
          isTableInputCell
          value={value ?? (isMultiselect ? [] : '')}
          onChange={({ values }) => onChange(isMultiselect ? values : values[0] ?? '')}
          placeholder={getTableHeaderFilterPickerPlaceholder(labelText, config.type)}
          label={filterLabelText}
          accessibilityLabel={filterLabelText}
        />
        <DropdownOverlay>
          <ActionList>
            {config.options.map((option) => (
              <ActionListItem key={option.value} title={option.label} value={option.value} />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};

/**
 * Auto-injected second header row rendering a compact search input for every column whose
 * `headerKey` is present in `filterFunctions` (see `TableProps['filterFunctions']`) - no extra
 * JSX required from consumers. A column also present in `filterConfig` renders a dropdown/
 * multiselect picker (see `TableHeaderFilterDropdownCell`) instead. Non-filterable columns (and
 * the leading checkbox / trailing hover-actions columns, when present) render as empty cells
 * purely to keep grid alignment.
 */
const TableHeaderFilterRow = ({
  headerRow,
  stickyTopOffsetPx,
  labelRowCount,
}: {
  headerRow: React.ReactNode;
  stickyTopOffsetPx?: number;
  labelRowCount: number;
}): React.ReactElement => {
  const {
    filterableColumns,
    columnFilterValues,
    setColumnFilterValue,
    filterConfig,
  } = useTableDataContext();
  const {
    backgroundColor,
    selectionType,
    hasHoverActions,
    showBorderedCells,
    shouldHeaderBeSticky,
    gridTemplateColumns,
    columnCount,
    isVirtualized,
  } = useTableRowContext();
  const cellsMeta = getHeaderCellsMeta(headerRow);
  // See `_TableHeaderRow`'s `cellStickyTopOffsetPx` - only meaningful once cells are sticky.
  const cellStickyTopOffsetPx = shouldHeaderBeSticky ? stickyTopOffsetPx : undefined;
  const selectColumnOffset = selectionType === 'multiple' ? 1 : 0;
  const filterGridRowStart = labelRowCount + 1;
  const filterGridRowValue = `${filterGridRowStart} / ${filterGridRowStart + 1}`;
  const lockColumnWidths = Boolean(gridTemplateColumns);

  const getFilterCellGridColumnStart = (columnIndex: number): number =>
    columnIndex + 1 + selectColumnOffset;
  const getFilterCellGridColumnEnd = (columnIndex: number): number =>
    columnIndex + 2 + selectColumnOffset;

  return (
    // See the real header row's own `role="row"` override below for why this is explicit.
    <StyledHeaderRow
      role="row"
      $showBorderedCells={showBorderedCells}
      $gridTemplateColumns={gridTemplateColumns}
      $hasHoverActions={hasHoverActions}
      $selectionType={selectionType}
      $columnCount={columnCount}
      $isVirtualized={isVirtualized}
      {...metaAttribute({ name: MetaConstants.TableHeaderRow })}
    >
      {selectionType === 'multiple' && (
        // Purely a grid-alignment spacer (no filter for the checkbox column) - excluded from the
        // accessibility tree rather than announced as an empty column header.
        <StyledFilterHeaderCell
          {...tableHeaderPresentationCellA11yProps}
          stiff={lockColumnWidths}
          gridColumnStart={1}
          gridColumnEnd={2}
          gridRowStart={filterGridRowStart}
          gridRowEnd={filterGridRowStart + 1}
          $gridRow={filterGridRowValue}
          $backgroundColor={backgroundColor}
          $stickyTopOffsetPx={cellStickyTopOffsetPx}
          $showBorderedCells={showBorderedCells}
        />
      )}
      {cellsMeta.map(({ headerKey, label }, index) => {
        const isFilterable = headerKey && filterableColumns.includes(headerKey);
        const labelText = getTableHeaderFilterLabelText(label, headerKey) || `Column ${index + 1}`;
        return (
          <StyledFilterHeaderCell
            key={headerKey ?? index}
            // Non-filterable columns render an empty spacer cell to keep grid alignment - give it
            // `role="presentation"` so it isn't announced as an empty column header.
            {...(isFilterable ? { role: 'columnheader' as const } : tableHeaderPresentationCellA11yProps)}
            stiff={lockColumnWidths}
            gridColumnStart={getFilterCellGridColumnStart(index)}
            gridColumnEnd={getFilterCellGridColumnEnd(index)}
            gridRowStart={filterGridRowStart}
            gridRowEnd={filterGridRowStart + 1}
            $gridRow={filterGridRowValue}
            $backgroundColor={backgroundColor}
            $stickyTopOffsetPx={cellStickyTopOffsetPx}
            $showBorderedCells={showBorderedCells}
          >
            {isFilterable && headerKey && filterConfig[headerKey] ? (
              <TableHeaderFilterDropdownCell
                headerKey={headerKey}
                config={filterConfig[headerKey]}
                value={columnFilterValues[headerKey]}
                labelText={labelText}
                onChange={(value) => setColumnFilterValue(headerKey, value)}
              />
            ) : isFilterable && headerKey ? (
              // Flush/borderless input filling the cell edge-to-edge (`isTableInputCell`), same
              // treatment as TableEditableCell's body-row inputs - the cell's own `:focus-within`
              // (see StyledFilterHeaderCell) shows the ring instead of the input itself.
              <BaseBox flex={1} marginX={tableHeaderBand.filterCellInsetX} minWidth="0px" width="100%">
                {(() => {
                  const filterInputId = `table-header-filter-${headerKey}`;
                  const filterLabelText = `Filter by ${labelText}`;
                  const filterValue = columnFilterValues[headerKey];
                  const hasFilterValue =
                    typeof filterValue === 'string'
                      ? filterValue.length > 0
                      : Array.isArray(filterValue) && filterValue.length > 0;
                  return (
                    <>
                      <VisuallyHidden>
                        <label htmlFor={filterInputId}>{filterLabelText}</label>
                      </VisuallyHidden>
                      <BaseInput
                      isTableInputCell
                      id={filterInputId}
                      size="small"
                      value={typeof filterValue === 'string' ? filterValue : ''}
                      onChange={({ value }) => setColumnFilterValue(headerKey, value ?? '')}
                      placeholder={getTableHeaderFilterTextPlaceholder(labelText)}
                      label={filterLabelText}
                      hideLabelText
                      accessibilityLabel={filterLabelText}
                      trailingIcon={hasFilterValue ? undefined : SearchIcon}
                      trailingInteractionElement={
                        hasFilterValue ? (
                          <IconButton
                            size={tableIcons.control}
                            icon={CloseIcon}
                            accessibilityLabel={`Clear ${labelText} filter`}
                            onClick={() => setColumnFilterValue(headerKey, '')}
                          />
                        ) : undefined
                      }
                    />
                    </>
                  );
                })()}
              </BaseBox>
            ) : null}
          </StyledFilterHeaderCell>
        );
      })}
      {hasHoverActions && (
        <StyledFilterHeaderCell
          {...tableHeaderPresentationCellA11yProps}
          stiff={lockColumnWidths}
          gridColumnStart={columnCount + selectColumnOffset + 1}
          gridColumnEnd={columnCount + selectColumnOffset + 2}
          gridRowStart={filterGridRowStart}
          gridRowEnd={filterGridRowStart + 1}
          $gridRow={filterGridRowValue}
          $backgroundColor={backgroundColor}
          $stickyTopOffsetPx={cellStickyTopOffsetPx}
          $showBorderedCells={showBorderedCells}
        />
      )}
    </StyledHeaderRow>
  );
};

const _TableHeader = ({ children, ...rest }: TableHeaderRowProps): React.ReactElement => {
  const { tableToolbarPlacement } = useTableRowContext();
  const { filterableColumns, showHeaderFilterRow } = useTableDataContext();

  // `TableHeader` may contain more than one `TableHeaderRow` (grouped multi-row headers - earlier
  // rows are group-label rows spanning leaf columns via `gridColumnStart`/`gridColumnEnd`, see
  // `TableCellGridSpanningProps`). By convention the LAST row is always the leaf/column row -
  // decorate each row with that fact and its stacked sticky offset so `TableHeaderRow` doesn't
  // need consumers to declare either explicitly.
  const childrenArray = React.Children.toArray(children);
  const headerRowIndices = childrenArray.reduce<number[]>((indices, child, index) => {
    if (getComponentId(child) === ComponentIds.TableHeaderRow) indices.push(index);
    return indices;
  }, []);
  const isMultiRowHeader = headerRowIndices.length > 1;
  const willShowFilterRow = showHeaderFilterRow && filterableColumns.length > 0;
  // Label row(s) need an explicit stacked `top` (including `0`) whenever a filter row sits below —
  // otherwise only the filter row gets `top` from styled props and the column-title row scrolls away.
  const shouldDecorateHeaderRowStickyOffsets = isMultiRowHeader || willShowFilterRow;
  const decoratedChildren = shouldDecorateHeaderRowStickyOffsets
    ? childrenArray.map((child, index) => {
        const rowPosition = headerRowIndices.indexOf(index);
        if (rowPosition === -1 || !React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          ...(isMultiRowHeader && {
            _isLeafHeaderRow: rowPosition === headerRowIndices.length - 1,
          }),
          _stickyTopOffsetPx: isMultiRowHeader
            ? rowPosition * TABLE_HEADER_COMPACT_ROW_HEIGHT_PX
            : 0,
          ...(willShowFilterRow ? { _gridRowStart: rowPosition + 1 } : {}),
        } as Partial<TableHeaderRowProps>);
      })
    : children;

  return (
    <StyledHeader
      $tableToolbarPlacement={tableToolbarPlacement}
      $headerFilterGridRowCount={
        willShowFilterRow ? headerRowIndices.length + 1 : undefined
      }
      {...metaAttribute({ name: MetaConstants.TableHeader })}
      {...makeAnalyticsAttribute(rest)}
    >
      {decoratedChildren}
      {showHeaderFilterRow && filterableColumns.length > 0 && (
        <TableHeaderFilterRow
          headerRow={children}
          labelRowCount={headerRowIndices.length}
          stickyTopOffsetPx={getFilterRowStickyTopOffsetPx(headerRowIndices.length)}
        />
      )}
    </StyledHeader>
  );
};

const TableHeader = assignWithoutSideEffects(_TableHeader, {
  displayName: 'TableHeader',
  componentId: ComponentIds.TableHeader,
});

const StyledHeaderCell = styled(HeaderCell)<{
  $isSortable: boolean;
  $backgroundColor: TableBackgroundColors;
  $rowDensity: NonNullable<TableProps<unknown>['rowDensity']>;
  $hasPadding: boolean;
  $textAlign: 'left' | 'center' | 'right';
  $gridRow?: string;
  $stickyTopOffsetPx?: number;
}>(
  ({
    theme,
    $isSortable,
    $backgroundColor,
    $rowDensity,
    $hasPadding,
    $textAlign,
    $gridRow,
    $stickyTopOffsetPx,
  }) => {
    const usesHorizontalHeaderLayout = Boolean($textAlign || $isSortable);
    const headerCellPaddingX = makeSpace(getIn(theme, tableHeaderBand.cellPaddingX));
    const cellPaddingLeft = $hasPadding ? headerCellPaddingX : undefined;
    const cellPaddingRight = $hasPadding ? headerCellPaddingX : undefined;
    const usesHeaderFilterGrid = Boolean($gridRow);
    const compactHeaderHeight = makeSize(TABLE_HEADER_COMPACT_ROW_HEIGHT_PX);
    const usesFlexHeaderCell = usesHorizontalHeaderLayout || usesHeaderFilterGrid;
    const filterGridInnerWrapper = {
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      flex: 1,
      alignSelf: 'stretch',
      minWidth: 0,
      width: '100%',
      height: '100%',
      minHeight: '100%',
    };
    return {
    '&&&': {
      display: usesFlexHeaderCell ? 'flex' : 'block',
      alignItems: usesFlexHeaderCell ? 'center' : undefined,
      justifyContent: usesHorizontalHeaderLayout ? 'space-between' : 'initial',
      // Grid tracks are explicit — do not let header content expand past the column (breaks sticky lanes).
      minWidth: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      alignSelf: 'stretch',
      boxSizing: 'border-box',
      ...(usesHeaderFilterGrid
        ? {
            height: compactHeaderHeight,
            minHeight: compactHeaderHeight,
            maxHeight: compactHeaderHeight,
            paddingTop: 0,
            paddingBottom: 0,
            borderTopWidth: 0,
            borderTopStyle: 'none',
          }
        : {
            minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
          }),
      ...(usesHorizontalHeaderLayout && !usesHeaderFilterGrid
        ? { paddingLeft: cellPaddingLeft, paddingRight: cellPaddingRight }
        : {}),
      backgroundColor: getIn(theme.colors, tableHeader.backgroundColor),
      borderBottomWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
      borderBottomColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
      borderBottomStyle: 'solid',
      ...(usesHeaderFilterGrid
        ? {}
        : {
            borderTopWidth: makeSpace(getIn(theme.border.width, tableHeader.borderBottomAndTopWidth)),
            borderTopColor: getIn(theme.colors, tableHeader.borderBottomAndTopColor),
            borderTopStyle: 'solid',
          }),
      cursor: $isSortable ? 'pointer' : 'auto',
      gridRow: $gridRow,
      // Grouped multi-row headers only - stacks this row's sticky position below the row(s) above
      // it (each fixed at the compact 36px header row height) instead of every row independently
      // sticking to `top: 0` and overlapping each other.
      ...($stickyTopOffsetPx != null
        ? { top: `${$stickyTopOffsetPx}px !important` }
        : {}),
      // @table-library wraps cell content in a single direct `div` — treat it as the flex row for
      // sortable headers (label + sort). Do not style every nested div (BaseBox) the same way.
      '> div': usesHeaderFilterGrid
        ? {
            ...filterGridInnerWrapper,
            justifyContent: $textAlign ? $textAlign : 'flex-start',
            paddingLeft: cellPaddingLeft,
            paddingRight: cellPaddingRight,
          }
        : usesHorizontalHeaderLayout
          ? {
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              alignSelf: 'stretch',
              minWidth: 0,
              width: '100%',
              minHeight: '100%',
            }
          : {
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: $textAlign ? $textAlign : 'space-between',
              alignItems: 'center',
              minHeight: makeSize(getIn(size, tableRow.minHeight[$rowDensity])),
              paddingLeft: cellPaddingLeft,
              paddingRight: cellPaddingRight,
            },
      '&:focus-visible': getFocusRingStyles({ theme, negativeOffset: true }),
    },
  };
  },
);

const _TableHeaderCell = ({
  children,
  headerKey,
  _hasPadding = true,
  _stickyTopOffsetPx,
  textAlign,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  ...rest
}: TableHeaderCellProps): React.ReactElement => {
  const { toggleSort, currentSortedState } = useTableDataContext();
  const { backgroundColor, rowDensity, headerRowDensity } = useTableRowContext();
  const isChildrenString = typeof children === 'string';
  const isSelectAllColumn = headerKey === 'SELECT';
  const isSortable =
    headerKey && Boolean(currentSortedState.sortableColumns?.find((key) => key === headerKey));

  const hasGridRowPlacement = gridRowStart != null && gridRowEnd != null;
  const gridRowValue = hasGridRowPlacement ? `${gridRowStart} / ${gridRowEnd}` : undefined;
  const hasMultiRowSpan = hasGridRowPlacement && gridRowEnd - gridRowStart > 1;

  const sortOrderIndex = currentSortedState.sortOrder.findIndex(
    (entry) => entry.sortKey === headerKey,
  );
  const sortDirection: 'asc' | 'desc' | 'none' =
    sortOrderIndex === -1 ? 'none' : currentSortedState.sortOrder[sortOrderIndex].direction;
  // Only show the priority badge once there's an actual multi-column sort to disambiguate -
  // a single sorted column keeps its existing, unbadged look.
  const sortPriority =
    currentSortedState.sortOrder.length > 1 && sortOrderIndex !== -1
      ? sortOrderIndex + 1
      : undefined;

  return (
    <StyledHeaderCell
      role="columnheader"
      tabIndex={0}
      className={hasMultiRowSpan ? classes.HAS_ROW_SPANNING : ''}
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      $gridRow={gridRowValue}
      $isSortable={isSortable}
      $backgroundColor={backgroundColor}
      $rowDensity={headerRowDensity ?? rowDensity}
      $hasPadding={_hasPadding}
      $textAlign={textAlign}
      $stickyTopOffsetPx={_stickyTopOffsetPx}
      onClick={(event: React.MouseEvent) => {
        if (isSortable) {
          toggleSort(headerKey, event.shiftKey);
        }
      }}
      {...metaAttribute({ name: MetaConstants.TableHeaderCell })}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display="flex"
        flexGrow={1}
        minWidth={0}
        overflow="hidden"
        width={isSelectAllColumn ? '100%' : undefined}
        alignItems="center"
        justifyContent={isSelectAllColumn ? 'center' : textAlign}
      >
        {isChildrenString ? (
          <Text size="small" weight="medium" color="surface.text.gray.muted">
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseBox>
      {isSortable && (
        <BaseBox
          paddingLeft={tableHeaderBand.sortIconGap}
          backgroundColor="transparent"
          flexShrink={0}
        >
          <SortIcon sortDirection={sortDirection} priority={sortPriority} />
        </BaseBox>
      )}
    </StyledHeaderCell>
  );
};

// Memoized so a re-render of this cell's parent (e.g. a sibling cell's own state change) that
// doesn't actually change this cell's own props is skipped. Note this does NOT skip re-renders
// triggered by a TableRowContext/TableDataContext change (e.g. sort state) - those are expected,
// since this cell reads its own sort indicator from that context.
const TableHeaderCell = assignWithoutSideEffects(React.memo(_TableHeaderCell), {
  displayName: 'TableHeaderCell',
  componentId: ComponentIds.TableHeaderCell,
});

const TableHeaderCellCheckbox = ({
  isChecked,
  isDisabled,
  isIndeterminate,
  onChange,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
}: {
  isChecked: CheckboxProps['isChecked'];
  isDisabled: CheckboxProps['isDisabled'];
  isIndeterminate?: CheckboxProps['isIndeterminate'];
  onChange: CheckboxProps['onChange'];
  gridColumnStart?: number;
  gridColumnEnd?: number;
  gridRowStart?: number;
  gridRowEnd?: number;
}): React.ReactElement => {
  return (
    <TableHeaderCell
      headerKey="SELECT"
      _hasPadding={false}
      textAlign="center"
      gridColumnStart={gridColumnStart}
      gridColumnEnd={gridColumnEnd}
      gridRowStart={gridRowStart}
      gridRowEnd={gridRowEnd}
    >
      <BaseBox
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        minWidth={makeSize(checkboxCellWidth)}
        maxWidth={makeSize(checkboxCellWidth)}
      >
        <Checkbox
          isChecked={isChecked}
          isDisabled={isDisabled}
          isIndeterminate={isIndeterminate}
          onChange={onChange}
        >
          <VisuallyHidden>Select all rows</VisuallyHidden>
        </Checkbox>
      </BaseBox>
    </TableHeaderCell>
  );
};

const _TableHeaderRow = ({
  children,
  rowDensity,
  _isLeafHeaderRow = true,
  _stickyTopOffsetPx,
  _gridRowStart,
  ...rest
}: TableHeaderRowProps): React.ReactElement => {
  const {
    disabledRows,
    selectionType,
    selectedRows,
    toggleAllRowsSelection,
    setHeaderRowDensity,
    showBorderedCells,
    hasHoverActions,
    gridTemplateColumns,
    columnCount,
    isVirtualized,
    shouldHeaderBeSticky,
  } = useTableRowContext();
  const { totalItems, tableData, showHeaderFilterRow, filterableColumns } = useTableDataContext();
  const hasHeaderFilterBand = showHeaderFilterRow && filterableColumns.length > 0;
  const isMultiSelect = selectionType === 'multiple';
  // Containment against the currently-visible rows (`tableData`), not a `selectedRows.length ===
  // totalItems` count comparison - `totalItems` tracks whatever `data` currently holds, which for
  // server-side pagination is only the current page, not every row that's ever been selected
  // across other pages. A count comparison against that would show this page as "indeterminate"
  // (or worse, get cleared entirely by `toggleAllRowsSelection`) purely because *other* pages have
  // selections, even when none of *this* page's rows are selected. See the Selection Across Pages
  // example.
  const visibleRowIds = React.useMemo(() => tableData.map((item) => item.id), [tableData]);
  const selectedRowIds = selectedRows ?? [];
  const isAllSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedRowIds.includes(id));
  const isIndeterminate = !isAllSelected && visibleRowIds.some((id) => selectedRowIds.includes(id));
  const isDisabled = disabledRows && disabledRows.length === totalItems;

  // Note: The rowDensity prop is deprecated (see types.ts for @deprecated documentation).
  // Header row is always compact (36px height) regardless of the rowDensity value passed.
  // This prop will be removed in a future major version.
  setHeaderRowDensity('compact');

  // `top: Npx` only makes sense to apply once this row's cells are actually `position: sticky`
  // (see `StyledHeaderCell`'s theme-driven `position`) - on a non-sticky `position: relative` cell
  // it would instead permanently shift the row down by that many pixels.
  const cellStickyTopOffsetPx =
    shouldHeaderBeSticky && _stickyTopOffsetPx != null ? _stickyTopOffsetPx : undefined;

  const selectColumnOffset = isMultiSelect ? 1 : 0;
  const labelRowGridPlacement =
    hasHeaderFilterBand && _gridRowStart != null
      ? {
          gridRowStart: _gridRowStart,
          gridRowEnd: _gridRowStart + 1,
        }
      : undefined;
  const labelRowCheckboxGridPlacement = labelRowGridPlacement
    ? { ...labelRowGridPlacement, gridColumnStart: 1, gridColumnEnd: 2 }
    : undefined;
  const labelRowActionsGridPlacement = labelRowGridPlacement
    ? {
        ...labelRowGridPlacement,
        gridColumnStart: columnCount + selectColumnOffset + 1,
        gridColumnEnd: columnCount + selectColumnOffset + 2,
      }
    : undefined;

  // Grouped multi-row headers (see `TableHeader`'s row decoration) only ever need the
  // checkbox/hover-actions placeholder cells once, on the leaf row - otherwise every group-label
  // row above it would also render its own "select all" checkbox / Actions placeholder.
  let labelRowDataColumnIndex = 0;
  const decoratedChildren = React.Children.map(children, (child) => {
    if (getComponentId(child) !== ComponentIds.TableHeaderCell || !React.isValidElement(child)) {
      return child;
    }
    const cellProps: Partial<TableHeaderCellProps> = {};
    if (cellStickyTopOffsetPx != null) {
      cellProps._stickyTopOffsetPx = cellStickyTopOffsetPx;
    }
    if (hasHeaderFilterBand && _gridRowStart != null) {
      cellProps.gridRowStart = _gridRowStart;
      cellProps.gridRowEnd = _gridRowStart + 1;
      const columnStart = labelRowDataColumnIndex + 1 + selectColumnOffset;
      cellProps.gridColumnStart = columnStart;
      cellProps.gridColumnEnd = columnStart + 1;
    }
    labelRowDataColumnIndex += 1;
    return Object.keys(cellProps).length > 0 ? React.cloneElement(child, cellProps) : child;
  });

  return (
    // `@table-library`'s own `HeaderRow` defaults its `role` prop to `"rowheader"` internally -
    // a WAI-ARIA *cell* role, not valid for an entire row - so it must be explicitly overridden
    // to `"row"` here rather than merely omitted (omitting it lets the library's own bad default
    // through unchanged).
    <StyledHeaderRow
      role="row"
      {...metaAttribute({ name: MetaConstants.TableHeaderRow })}
      {...makeAnalyticsAttribute(rest)}
      $showBorderedCells={showBorderedCells}
      $gridTemplateColumns={gridTemplateColumns}
      $hasHoverActions={hasHoverActions}
      $selectionType={selectionType}
      $columnCount={columnCount}
      $isVirtualized={isVirtualized}
    >
      {isMultiSelect &&
        (_isLeafHeaderRow ? (
          <TableHeaderCellCheckbox
            isChecked={isAllSelected}
            isDisabled={isDisabled}
            isIndeterminate={isIndeterminate}
            onChange={() => toggleAllRowsSelection()}
            {...labelRowCheckboxGridPlacement}
          />
        ) : (
          // Group-label rows (grouped multi-row headers) don't repeat the "select all" checkbox -
          // an empty spacer cell keeps this row's columns aligned with the leaf row below it,
          // which does reserve a real column for it.
          <TableHeaderCell _hasPadding={false} {...labelRowCheckboxGridPlacement}>
            {null}
          </TableHeaderCell>
        ))}
      {decoratedChildren}
      {hasHoverActions ? (
        _isLeafHeaderRow ? (
          <TableHeaderCell _hasPadding={false} {...labelRowActionsGridPlacement}>
            <VisuallyHidden>Actions</VisuallyHidden>
          </TableHeaderCell>
        ) : (
          // Same alignment spacer as the checkbox column above, for the trailing hover-actions
          // column on group-label rows.
          <TableHeaderCell _hasPadding={false} {...labelRowActionsGridPlacement}>
            {null}
          </TableHeaderCell>
        )
      ) : null}
    </StyledHeaderRow>
  );
};

const TableHeaderRow = assignWithoutSideEffects(_TableHeaderRow, {
  displayName: 'TableHeaderRow',
  componentId: ComponentIds.TableHeaderRow,
});

export { TableHeader, TableHeaderRow, TableHeaderCell };
