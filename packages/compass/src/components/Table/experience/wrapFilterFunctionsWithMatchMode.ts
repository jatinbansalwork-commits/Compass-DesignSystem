import { matchesWithMode, type TableExperienceFilterMatchMode } from './filterMatchMode';
import type { TableNode } from '../types';

type FilterFieldExtractors<Item> = Record<string, (item: TableNode<Item>) => string>;

/**
 * Wraps app {@link filterFunctions} so advanced-filter match modes apply to extracted field
 * text before your predicate runs (same `filterValue` shape as {@link Table}).
 */
const wrapFilterFunctionsWithMatchMode = <Item>(
  filterFunctions: Record<string, (item: TableNode<Item>, filterValue: string | string[]) => boolean>,
  filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>,
  fieldExtractors: FilterFieldExtractors<Item> | undefined,
): Record<string, (item: TableNode<Item>, filterValue: string | string[]) => boolean> => {
  return Object.fromEntries(
    Object.entries(filterFunctions).map(([key, predicate]) => {
      const extractor = fieldExtractors?.[key];
      const mode = filterMatchModes[key] ?? 'contains';
      return [
        key,
        (item: TableNode<Item>, filterValue: string | string[]) => {
          if (extractor && typeof filterValue === 'string' && filterValue.length > 0) {
            if (!matchesWithMode(extractor(item), filterValue, mode)) {
              return false;
            }
          }
          return predicate(item, filterValue);
        },
      ];
    }),
  );
};

export { wrapFilterFunctionsWithMatchMode };
export type { FilterFieldExtractors };
