import type { Meta, Parameters } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

/**
 * Storybook Actions panel — Table and TablePagination callbacks.
 * @see STORYBOOK_STANDARDS.md
 */
const TABLE_STORY_ACTIONS_ARG_TYPES_REGEX =
  '^on(SelectionChange|SortChange|GlobalFilterValueChange|ColumnFilterValuesChange|ExpandedRowIdsChange|PageChange|PageSizeChange|RowHover|CellClick).*';

/** Default a11y addon rules for Table stories (skipped in interaction test file). */
const tableA11yParameters: NonNullable<Parameters['a11y']> = {
  config: {
    rules: [
      { id: 'color-contrast', enabled: true },
      { id: 'label', enabled: true },
      { id: 'button-name', enabled: true },
      { id: 'aria-required-attr', enabled: true },
      { id: 'aria-allowed-attr', enabled: true },
      { id: 'aria-valid-attr-value', enabled: true },
      { id: 'nested-interactive', enabled: true },
    ],
  },
};

const tableStoryParameters: Parameters = {
  controls: { expanded: true, sort: 'requiredFirst' },
  actions: { argTypesRegex: TABLE_STORY_ACTIONS_ARG_TYPES_REGEX },
  a11y: tableA11yParameters,
};

/** Fixed demos — no Controls/Actions noise; a11y stays enabled. */
const tableRecipeStoryParameters: Parameters = {
  controls: { disable: true },
  actions: { disable: true },
};

/** Reference recipes with `.play` smoke tests (All use cases, stress, line items, keyboard). */
const tableFlagshipRecipeParameters: Parameters = {
  ...tableStoryParameters,
  actions: { disable: true },
  a11y: tableA11yParameters,
  docs: {
    description: {
      component:
        'Flagship Table recipe. Use the **Interactions** panel (or `yarn test:react:interaction`) to run the `.play` test. **Accessibility** addon rules are enabled.',
    },
  },
};

/** `Components/Interaction Tests/Table` — test-runner only. */
const tableInteractionTestParameters: Parameters = {
  controls: { disable: true },
  actions: { disable: true },
  a11y: { disable: true },
  essentials: { disable: true },
};

const tableComposableArgTypes = {
  ...getStyledPropsArgTypes(),
  data: { control: { disable: true }, table: { category: 'Data' } },
  children: { control: { disable: true }, table: { category: 'Data' } },
  toolbar: { control: { disable: true }, table: { category: 'Composition' } },
  pagination: { control: { disable: true }, table: { category: 'Composition' } },
  sortFunctions: { control: { disable: true }, table: { category: 'Data' } },
  filterFunctions: { control: { disable: true }, table: { category: 'Filtering' } },
  filterConfig: { control: { disable: true }, table: { category: 'Filtering' } },
  columnFilterValues: { control: { disable: true }, table: { category: 'Filtering' } },
  defaultColumnFilterValues: { control: { disable: true }, table: { category: 'Filtering' } },
  columns: { control: { disable: true }, table: { category: 'Data' } },
  experienceApi: { control: { disable: true }, table: { category: 'Experience' } },
  gridTemplateColumns: { control: { disable: true }, table: { category: 'Layout' } },
  stickyColumnWidths: { control: { disable: true }, table: { category: 'Layout' } },
  trailingStickyColumnWidths: { control: { disable: true }, table: { category: 'Layout' } },
  disabledRows: { control: { disable: true }, table: { category: 'Behavior' } },
  defaultSelectedIds: { control: { disable: true }, table: { category: 'Behavior' } },
  selectedIds: { control: { disable: true }, table: { category: 'Behavior' } },
  initialSort: { control: { disable: true }, table: { category: 'Behavior' } },
};

/**
 * Matches {@link Table} runtime defaults in `Table.web.tsx` / `TableProps` JSDoc.
 * Spread into playground meta `args` so Controls show real values (not “Set boolean”).
 */
const tableDefaultStoryArgs = {
  selectionType: 'none' as const,
  multiSelectTrigger: 'row' as const,
  checkboxDisplay: 'always' as const,
  isGrouped: false,
  rowDensity: 'normal' as const,
  isHeaderSticky: false,
  isFooterSticky: false,
  isFirstColumnSticky: false,
  isLastColumnSticky: false,
  stickyColumnCount: 0,
  trailingStickyColumnCount: 0,
  showBorderedCells: false,
  showStripedRows: false,
  showHeaderFilterRow: true,
  globalFilterValue: '',
  isLoading: false,
  isRefreshing: false,
};

const tableBehaviorArgTypes = {
  selectionType: {
    control: 'select' as const,
    options: ['none', 'single', 'multiple'],
    table: { category: 'Behavior', defaultValue: { summary: `'none'` } },
  },
  multiSelectTrigger: {
    control: 'select' as const,
    options: ['checkbox', 'row'],
    table: { category: 'Behavior', defaultValue: { summary: `'row'` } },
    if: { arg: 'selectionType', eq: 'multiple' },
  },
  checkboxDisplay: {
    control: 'select' as const,
    options: ['always', 'on-hover'],
    table: { category: 'Behavior', defaultValue: { summary: `'always'` } },
    if: { arg: 'selectionType', neq: 'none' },
  },
  isGrouped: {
    control: 'boolean',
    table: { category: 'Behavior', defaultValue: { summary: 'false' } },
  },
};

const tableLayoutArgTypes = {
  rowDensity: {
    control: 'select' as const,
    options: ['compact', 'normal', 'comfortable'],
    table: { category: 'Layout', defaultValue: { summary: `'normal'` } },
  },
  isHeaderSticky: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  isFooterSticky: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  isFirstColumnSticky: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  stickyColumnCount: {
    control: { type: 'number', min: 0, max: 8, step: 1 },
    table: { category: 'Layout', defaultValue: { summary: '0' } },
  },
  trailingStickyColumnCount: {
    control: { type: 'number', min: 0, max: 4, step: 1 },
    table: { category: 'Layout', defaultValue: { summary: '0' } },
  },
  isLastColumnSticky: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  showBorderedCells: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  showStripedRows: {
    control: 'boolean',
    table: { category: 'Layout', defaultValue: { summary: 'false' } },
  },
  height: {
    control: 'text',
    table: { category: 'Layout', defaultValue: { summary: 'undefined (auto height)' } },
    description: 'Scroll container height (e.g. `500px`, `50vh`). Leave empty for auto.',
  },
};

const tableFilteringArgTypes = {
  showHeaderFilterRow: {
    control: 'boolean',
    table: { category: 'Filtering', defaultValue: { summary: 'true' } },
  },
  globalFilterValue: {
    control: 'text',
    table: { category: 'Filtering', defaultValue: { summary: `''` } },
  },
};

const tableStateArgTypes = {
  isLoading: {
    control: 'boolean',
    table: { category: 'State', defaultValue: { summary: 'false' } },
  },
  isRefreshing: {
    control: 'boolean',
    table: { category: 'State', defaultValue: { summary: 'false' } },
  },
};

const tableStoryArgTypes = {
  ...tableComposableArgTypes,
  ...tableBehaviorArgTypes,
  ...tableLayoutArgTypes,
  ...tableFilteringArgTypes,
  ...tableStateArgTypes,
};

const tableCallbackStoryArgs = {
  onSelectionChange: fn(),
  onSortChange: fn(),
  onGlobalFilterValueChange: fn(),
  onColumnFilterValuesChange: fn(),
  onExpandedRowIdsChange: fn(),
};

const tablePaginationCallbackArgs = {
  onPageChange: fn(),
  onPageSizeChange: fn(),
};

type TableStoryMode = 'playground' | 'recipe' | 'flagship';

const getTableStoryModeParameters = (mode: TableStoryMode): Parameters => {
  if (mode === 'recipe') {
    return tableRecipeStoryParameters;
  }
  if (mode === 'flagship') {
    return tableFlagshipRecipeParameters;
  }
  return {};
};

const mergeTableStoryMeta = <T>(meta: Meta<T>, mode: TableStoryMode = 'playground'): Meta<T> => {
  const modeParameters = getTableStoryModeParameters(mode);

  return {
    ...meta,
    tags: meta.tags ?? ['autodocs'],
    argTypes: {
      ...tableStoryArgTypes,
      ...(meta.argTypes ?? {}),
    },
    parameters: {
      ...tableStoryParameters,
      ...modeParameters,
      ...(meta.parameters ?? {}),
    },
    args: {
      ...tableDefaultStoryArgs,
      ...(mode === 'playground' || mode === 'flagship' ? tableCallbackStoryArgs : {}),
      ...(meta.args ?? {}),
    },
  };
};

const withTableStoryMeta = <T>(meta: Meta<T>): Meta<T> => mergeTableStoryMeta(meta, 'playground');

const withTableRecipeMeta = <T>(meta: Meta<T>): Meta<T> => mergeTableStoryMeta(meta, 'recipe');

const withTableFlagshipRecipeMeta = <T>(meta: Meta<T>): Meta<T> =>
  mergeTableStoryMeta(meta, 'flagship');

/** Mutates `meta` in place so CSF can `export default meta` with an object literal binding. */
const applyTableStoryMeta = <T>(meta: Meta<T>): Meta<T> => {
  Object.assign(meta, mergeTableStoryMeta(meta, 'playground'));
  return meta;
};

const applyTableRecipeMeta = <T>(meta: Meta<T>): Meta<T> => {
  Object.assign(meta, mergeTableStoryMeta(meta, 'recipe'));
  return meta;
};

const applyTableFlagshipRecipeMeta = <T>(meta: Meta<T>): Meta<T> => {
  Object.assign(meta, mergeTableStoryMeta(meta, 'flagship'));
  return meta;
};

export type { Parameters as TableStoryParameters, TableStoryMode };
export {
  TABLE_STORY_ACTIONS_ARG_TYPES_REGEX,
  tableA11yParameters,
  tableStoryParameters,
  tableRecipeStoryParameters,
  tableFlagshipRecipeParameters,
  tableInteractionTestParameters,
  tableComposableArgTypes,
  tableBehaviorArgTypes,
  tableLayoutArgTypes,
  tableFilteringArgTypes,
  tableStateArgTypes,
  tableStoryArgTypes,
  tableDefaultStoryArgs,
  tableCallbackStoryArgs,
  tablePaginationCallbackArgs,
  mergeTableStoryMeta,
  withTableStoryMeta,
  withTableRecipeMeta,
  withTableFlagshipRecipeMeta,
  applyTableStoryMeta,
  applyTableRecipeMeta,
  applyTableFlagshipRecipeMeta,
};
