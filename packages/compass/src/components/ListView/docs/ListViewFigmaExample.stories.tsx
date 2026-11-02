import type { StoryFn, Meta } from '@storybook/react-vite';
import React, { useState } from 'react';
import { ListView } from '../ListView';
import type { ListViewProps } from '../types';
import { ListViewFilters } from '../ListViewFilters';
import type { Identifier, TableData } from '~components/Table/types';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { ShareIcon, DownloadIcon, CopyIcon, TrashIcon } from '~components/Icons';
import { Code } from '~components/Typography/Code';
import { Amount } from '~components/Amount';
import { QuickFilter, QuickFilterGroup } from '~components/QuickFilters';
import { Counter } from '~components/Counter';
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
  TableToolbarActions,
  TableToolbar,
} from '~components/Table';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { ButtonGroup } from '~components/ButtonGroup';
import { Tooltip } from '~components/Tooltip';
import { SearchInput } from '~components/Input/SearchInput';
import {
  FilterChipSelectInput,
  Dropdown,
  DropdownOverlay,
  FilterChipGroup,
} from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { DatesRangeValue } from '~components/DatePicker';
import { FilterChipDatePicker } from '~components/DatePicker';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

export default {
  title: 'Patterns/ListView',
  component: ListView,
} as Meta<ListViewProps>;

const MethodFilterValues = [
  { key: 'ocean', title: 'Ocean' },
  { key: 'air', title: 'Air' },
  { key: 'truck', title: 'Truck' },
];

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: {
    key: string;
    title: string;
  };
  bank: string;
  account: string;
  name: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `KX-${String(Math.floor(Math.random() * 900000 + 100000)).padStart(6, '0')}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Released', 'Exam hold', 'Rejected', 'Pending CBP review'][Math.floor(Math.random() * 4)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Formal entry', 'Consumption entry', 'Temporary import'][Math.floor(Math.random() * 3)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['Meridian Customs', 'Pacific Rim Brokerage', 'Harborline Brokers'][Math.floor(Math.random() * 3)],
    account: ['8471.30.0100', '2933.99.8200', '8703.23.0190', '4011.10.1000'][Math.floor(Math.random() * 4)],
    name: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Smith'][Math.floor(Math.random() * 4)],
  })),
];

const data: TableData<Item> = { nodes };
const quickFilters = ['All', 'Exam hold', 'Rejected', 'Released'];
const filterChipQuickFilters = ['Exam hold', 'Rejected', 'Released'];

const BulkActionContent = (): React.ReactElement => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Identifier[]>([]);

  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') return data.nodes.length;
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (tableData: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') return { nodes: tableData.nodes };
    return { nodes: tableData.nodes.filter((node) => node.status === value) };
  };
  const getSearchedData = (tableData: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) return { nodes: tableData.nodes };
    return { nodes: tableData.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (tableData: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) return { nodes: tableData.nodes };
    return { nodes: tableData.nodes.filter((node) => node.method.key === value) };
  };
  const getFilterRangeData = (
    tableData: TableData<Item>,
    value?: DatesRangeValue,
  ): TableData<Item> => {
    if (!value?.[0]) return { nodes: tableData.nodes };
    return {
      nodes: tableData.nodes.filter((node) => {
        if (!value?.[0] || !value?.[1]) return false;
        return node.date >= value[0] && node.date <= value[1];
      }),
    };
  };

  return (
    <BaseBox
      backgroundColor="surface.background.gray.moderate"
      padding="spacing.8"
      minHeight="500px"
    >
      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup
              selectionType="single"
              onChange={({ values }) => {
                const value = values[0];
                const quickFilterData = getQuickFilterData(data, value);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                setListViewTableData(dateRangeFilterData);
                setSelectedQuickFilter(value);
              }}
              defaultValue="All"
              value={selectedQuickFilter}
            >
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
                />
              ))}
            </QuickFilterGroup>
          }
          selectedFiltersCount={
            (methodFilter ? 1 : 0) +
            (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
            (selectedQuickFilter !== 'All' ? 1 : 0)
          }
          actions={
            <Box display="flex" gap="spacing.4" alignItems="center">
              <Box width="208px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search shipment ID (KX-)"
                  onChange={({ value }) => {
                    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                    const searchValueData = getSearchedData(quickFilterData, value);
                    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                    const dateRangeFilterData = getFilterRangeData(
                      methodFilterData,
                      filterDateRange,
                    );
                    setListViewTableData(dateRangeFilterData);
                    setSearchValue(value);
                  }}
                  onClearButtonClick={() => {
                    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
                    const dateRangeFilterData = getFilterRangeData(
                      methodFilterData,
                      filterDateRange,
                    );
                    setListViewTableData(dateRangeFilterData);
                    setSearchValue('');
                  }}
                />
              </Box>
              <ButtonGroup variant="tertiary">
                <Tooltip content="Download data">
                  <Button icon={DownloadIcon} />
                </Tooltip>
                <Tooltip content="Share">
                  <Button icon={ShareIcon} />
                </Tooltip>
              </ButtonGroup>
            </Box>
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              setListViewTableData(searchValueData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                    <ActionListItem key={index} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              onChange={(value) => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((status, index) => (
                    <ActionListItem
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                      key={index}
                      title={status}
                      value={status}
                      isSelected={selectedQuickFilter === status}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          data={listViewTableData}
          onSelectionChange={({ selectedIds: ids }) => {
            setSelectedIds(ids);
          }}
          isFirstColumnSticky
          selectionType="multiple"
          rowDensity="compact"
          pagination={
            <TablePagination
              onPageChange={console.log}
              defaultPageSize={10}
              onPageSizeChange={console.log}
              showPageSizePicker
              showPageNumberSelector
            />
          }
          toolbar={
            selectedIds.length > 0 ? (
              <TableToolbar placement="overlay" title={`${selectedIds.length} selected`}>
                <TableToolbarActions>
                  <Box
                    width="100%"
                    justifyContent="end"
                    display="flex"
                    alignItems="center"
                    gap="spacing.4"
                  >
                    <Link size="small" icon={CopyIcon}>
                      Copy
                    </Link>
                    <Link size="small" icon={TrashIcon}>
                      Delete
                    </Link>
                  </Box>
                </TableToolbarActions>
              </TableToolbar>
            ) : undefined
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="SHIPMENT_ID">Shipment ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Duty amount</TableHeaderCell>
                  <TableHeaderCell headerKey="ACCOUNT">HTS code</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">MOT</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                  <TableRow key={index} item={tableItem}>
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      <Link size="small" color="neutral" target="_blank" href="/">
                        {tableItem.account}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {tableItem.date?.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{tableItem.method.title}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Released'
                            ? 'positive'
                            : tableItem.status === 'Exam hold'
                            ? 'notice'
                            : tableItem.status === 'Rejected'
                            ? 'negative'
                            : 'primary'
                        }
                      >
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  <TableFooterCell>Total</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const ListViewFigmaExample: StoryFn<typeof ListView> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.8">
    <BulkActionContent />
    <CompassProvider themeTokens={compassTheme} colorScheme="dark">
      <BulkActionContent />
    </CompassProvider>
  </Box>
);

ListViewFigmaExample.storyName = 'ListViewFigmaExample';
