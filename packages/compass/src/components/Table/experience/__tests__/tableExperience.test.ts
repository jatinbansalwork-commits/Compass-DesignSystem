import { applyInitialSort } from '../applyInitialSort';
import { escapeCsvCell, exportTableToCsv } from '../exportTableToCsv';
import { getEmptyReason } from '../getEmptyReason';
import { applyMultiSort } from '../../sort/applyMultiSort';
import { collectGroupHeaderIds } from '../../utils/collectGroupHeaderIds';
import { toggleExperienceSort } from '../toggleExperienceSort';
import { matchesWithMode } from '../filterMatchMode';
import { buildGridTemplateColumns } from '../buildGridTemplateColumns';
import { orderedVisibleColumnKeys, reorderColumnKeys } from '../reorderColumnKeys';

describe('table experience utilities', () => {
  describe('applyInitialSort', () => {
    const nodes = [
      { id: '1', name: 'Charlie' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ];

    const sortFunctions = {
      name: (array: typeof nodes) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
    };

    it('returns nodes unchanged when initialSort is missing', () => {
      expect(applyInitialSort(nodes, undefined, sortFunctions)).toEqual(nodes);
    });

    it('presorts ascending via sortFunctions', () => {
      const sorted = applyInitialSort(nodes, { sortKey: 'name', direction: 'asc' }, sortFunctions);
      expect(sorted.map((row) => row.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('presorts descending', () => {
      const sorted = applyInitialSort(nodes, { sortKey: 'name', direction: 'desc' }, sortFunctions);
      expect(sorted.map((row) => row.name)).toEqual(['Charlie', 'Bob', 'Alice']);
    });
  });

  describe('exportTableToCsv', () => {
    it('escapes commas and quotes', () => {
      expect(escapeCsvCell('a,b')).toBe('"a,b"');
      expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
    });

    it('builds csv with header row', () => {
      const csv = exportTableToCsv(
        [{ id: '1', label: 'One' }],
        [{ header: 'Label', getValue: (row) => row.label }],
      );
      expect(csv).toBe('Label\nOne');
    });
  });

  describe('applyMultiSort', () => {
    it('sorts by primary then secondary keys', () => {
      const nodes = [
        { id: '1', status: 'B', name: 'a' },
        { id: '2', status: 'A', name: 'b' },
        { id: '3', status: 'A', name: 'a' },
      ];
      const fns = {
        status: (arr: typeof nodes) => [...arr].sort((a, b) => a.status.localeCompare(b.status)),
        name: (arr: typeof nodes) => [...arr].sort((a, b) => a.name.localeCompare(b.name)),
      };
      const sorted = applyMultiSort(nodes, [
        { sortKey: 'status', direction: 'asc' },
        { sortKey: 'name', direction: 'asc' },
      ], fns);
      expect(sorted.map((n) => n.id)).toEqual(['3', '2', '1']);
    });
  });

  describe('toggleExperienceSort', () => {
    it('stacks columns when shift is held', () => {
      expect(toggleExperienceSort([], 'a', { shiftKey: true })).toEqual([
        { sortKey: 'a', direction: 'asc' },
      ]);
      expect(toggleExperienceSort([{ sortKey: 'a', direction: 'asc' }], 'b', { shiftKey: true })).toEqual([
        { sortKey: 'a', direction: 'asc' },
        { sortKey: 'b', direction: 'asc' },
      ]);
    });
  });

  describe('matchesWithMode', () => {
    it('supports startsWith', () => {
      expect(matchesWithMode('Hello', 'he', 'startsWith')).toBe(true);
      expect(matchesWithMode('Hello', 'lo', 'startsWith')).toBe(false);
    });
  });

  describe('buildGridTemplateColumns', () => {
    it('maps ordered keys to minmax segments', () => {
      const grid = buildGridTemplateColumns(
        ['a', 'b'],
        { a: 200 },
        [{ key: 'a' }, { key: 'b', defaultWidthPx: 100 }],
        ['1fr'],
      );
      expect(grid).toBe('minmax(80px, 200px) minmax(80px, 100px) 1fr');
    });
  });

  describe('reorderColumnKeys', () => {
    it('moves a key within order', () => {
      expect(reorderColumnKeys(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    });

    it('filters visible keys by layout order', () => {
      expect(orderedVisibleColumnKeys(['b', 'a', 'c'], ['a', 'c'])).toEqual(['a', 'c']);
    });
  });

  describe('collectGroupHeaderIds', () => {
    it('collects ids of nodes with children', () => {
      const nodes = [
        { id: 'a', nodes: [{ id: 'a1', nodes: null }] },
        { id: 'b', nodes: null },
      ];
      expect(collectGroupHeaderIds(nodes)).toEqual(['a']);
    });
  });

  describe('getEmptyReason', () => {
    it('distinguishes no data vs no results', () => {
      expect(getEmptyReason(0, 0)).toBe('no-data');
      expect(getEmptyReason(0, 5)).toBe('no-results');
      expect(getEmptyReason(2, 5)).toBe(null);
    });
  });
});
