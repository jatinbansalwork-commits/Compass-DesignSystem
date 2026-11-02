import { applyInitialSort } from '../applyInitialSort';
import { escapeCsvCell, exportTableToCsv } from '../exportTableToCsv';
import { getEmptyReason } from '../getEmptyReason';
import { applyMultiSort } from '../../sort/applyMultiSort';
import { collectGroupHeaderIds } from '../../utils/collectGroupHeaderIds';
import { toggleExperienceSort } from '../toggleExperienceSort';
import { matchesWithMode } from '../filterMatchMode';
import { buildGridTemplateColumns } from '../buildGridTemplateColumns';
import { buildExperienceStickyLeadingLayout } from '../buildExperienceStickyLeadingLayout';
import { getFilterRowStickyTopOffsetPx } from '../../headerLayoutConstants';
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

  describe('getFilterRowStickyTopOffsetPx', () => {
    it('matches compact row height per label row (borders inside the row box)', () => {
      expect(getFilterRowStickyTopOffsetPx(1)).toBe(36);
      expect(getFilterRowStickyTopOffsetPx(2)).toBe(72);
    });
  });

  describe('buildExperienceStickyLeadingLayout', () => {
    it('freezes the first N data columns in order', () => {
      const layout = buildExperienceStickyLeadingLayout({
        orderedColumnKeys: ['SHIPMENT_ID', 'NAME', 'STATUS', 'HTS'],
        stickyLeadingDataColumnCount: 1,
        columnWidths: { SHIPMENT_ID: 160 },
        columns: [{ key: 'SHIPMENT_ID', defaultWidthPx: 140 }],
      });
      expect(layout.stickyColumnCount).toBe(1);
      expect(layout.stickyLeadingColumnKeys).toEqual(['SHIPMENT_ID']);
      expect(layout.stickyColumnWidths).toEqual(['160px']);
    });

    it('clamps count to visible column length', () => {
      const layout = buildExperienceStickyLeadingLayout({
        orderedColumnKeys: ['a'],
        stickyLeadingDataColumnCount: 5,
        columnWidths: {},
        columns: [{ key: 'a', defaultWidthPx: 100 }],
      });
      expect(layout.stickyColumnCount).toBe(1);
      expect(layout.stickyColumnWidths).toEqual(['100px']);
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

    it('uses fixed px for leading columns when sticky lane is configured', () => {
      const grid = buildGridTemplateColumns(
        ['a', 'b', 'c'],
        { a: 200, b: 120 },
        [{ key: 'a' }, { key: 'b', defaultWidthPx: 100 }, { key: 'c' }],
        ['minmax(80px, 1fr)'],
        2,
      );
      expect(grid).toBe('200px 120px minmax(80px, 140px) minmax(80px, 1fr)');
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
