import {
  toggleTableSort,
  toggleTableSortFromTableHeader,
  type ToggleTableSortOptions,
} from '../sort/toggleTableSort';

type ToggleExperienceSortOptions = ToggleTableSortOptions;

const toggleExperienceSort = toggleTableSort;
const toggleExperienceSortFromTableHeader = toggleTableSortFromTableHeader;

export { toggleExperienceSort, toggleExperienceSortFromTableHeader };
export type { ToggleExperienceSortOptions };
