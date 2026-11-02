import React from 'react';
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Header, Body } from '@table-library/react-table-library/table';
import { getRowHeight } from '@table-library/react-table-library/virtualized';
import type { TableNode as LibraryTableNode } from '@table-library/react-table-library/types/table';
import type { VirtualizedProps } from '@table-library/react-table-library/types/virtualized';

const SHARED_VIRTUALIZE_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'var(--data-table-library_grid-template-columns)',
} as const;

/**
 * Same as {@link @table-library}'s `Virtualized`, except row `top` follows react-window only.
 * The upstream component adds `rowHeight(index)` to every row's `top`; with Kdesign's in-flow
 * sticky header that creates a redundant gap above the first body row.
 */
const KdesignTableVirtualized = <T extends LibraryTableNode>({
  tableList,
  rowHeight,
  header,
  body,
  tableOptions,
  rowOptions,
}: VirtualizedProps<T>): React.ReactElement => {
  return (
    <>
      {tableOptions?.renderBeforeTable?.()}
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) => (
          <VariableSizeList
            height={height}
            width={width}
            itemCount={tableList.length}
            itemSize={(index) => getRowHeight(rowHeight, tableList[index], index)}
            innerElementType={React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
              ({ children, ...rest }, ref) => (
                <div ref={ref} {...rest}>
                  <div
                    style={{
                      ...SHARED_VIRTUALIZE_STYLE,
                      position: 'sticky',
                      insetBlockStart: 0,
                      zIndex: 3,
                    }}
                  >
                    <Header>{header()}</Header>
                  </div>
                  <Body>{children}</Body>
                </div>
              ),
            )}
            itemData={{ items: tableList }}
          >
            {({ index, style, data }) => (
              <div style={{ ...style, ...SHARED_VIRTUALIZE_STYLE }}>
                {rowOptions?.renderBeforeRow?.(data.items[index], index)}
                {body(data.items[index], index)}
                {rowOptions?.renderAfterRow?.(data.items[index], index)}
              </div>
            )}
          </VariableSizeList>
        )}
      </AutoSizer>
      {tableOptions?.renderAfterTable?.()}
    </>
  );
};

export { KdesignTableVirtualized };
