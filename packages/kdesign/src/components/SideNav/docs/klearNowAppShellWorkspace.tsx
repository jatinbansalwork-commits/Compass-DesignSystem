import React from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '~components/Table';
import type { TableData } from '~components/Table/types';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Card, CardBody } from '~components/Card';
import { Heading, Text } from '~components/Typography';

type TransactionRow = {
  id: string;
  reference: string;
  status: 'In transit' | 'Customs hold' | 'Delivered';
  updated: string;
};

const SAMPLE_TRANSACTION_TABLE_DATA: TableData<TransactionRow> = {
  nodes: [
    { id: '1', reference: 'SHP-10482', status: 'In transit', updated: 'Nov 1, 2026' },
    { id: '2', reference: 'SHP-10471', status: 'Customs hold', updated: 'Oct 31, 2026' },
    { id: '3', reference: 'SHP-10455', status: 'Delivered', updated: 'Oct 30, 2026' },
  ],
};

const statusBadgeColor = (status: TransactionRow['status']): 'notice' | 'negative' | 'positive' => {
  if (status === 'Customs hold') {
    return 'negative';
  }
  if (status === 'Delivered') {
    return 'positive';
  }
  return 'notice';
};

/** List-style workspace for Transaction Manager routes (App Shell pattern). */
const KlearNowTransactionManagerWorkspace = (): React.ReactElement => {
  return (
    <Box padding="spacing.6" minHeight="100%">
      <Heading size="large" weight="semibold">
        Active transactions
      </Heading>
      <Text marginTop="spacing.2" color="surface.text.gray.subtle">
        Shipments and customs entries synced from KlearNow operations.
      </Text>
      <Box marginTop="spacing.6" overflow="auto">
        <Table data={SAMPLE_TRANSACTION_TABLE_DATA}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Reference</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Last updated</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id} item={row}>
                    <TableCell>{row.reference}</TableCell>
                    <TableCell>
                      <Badge color={statusBadgeColor(row.status)} emphasis="subtle">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.updated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </Box>
    </Box>
  );
};

const KlearNowDashboardHomeWorkspace = (): React.ReactElement => {
  return (
    <Box padding="spacing.6" minHeight="100%">
      <Heading size="large" weight="semibold">
        Dashboard
      </Heading>
      <Text marginTop="spacing.2" color="surface.text.gray.subtle">
        Overview of your trade operations.
      </Text>
      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        gap="spacing.4"
        marginTop="spacing.6"
      >
        {[
          { label: 'Active shipments', value: '128' },
          { label: 'Pending customs entries', value: '14' },
          { label: 'Documents awaiting review', value: '9' },
        ].map((metric) => (
          <Box key={metric.label} flex="1">
            <Card>
              <CardBody>
                <Text size="small" color="surface.text.gray.subtle">
                  {metric.label}
                </Text>
                <Heading marginTop="spacing.2" size="large">
                  {metric.value}
                </Heading>
              </CardBody>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

type KlearNowGenericRouteWorkspaceProps = {
  pathname: string;
};

const KlearNowGenericRouteWorkspace = ({
  pathname,
}: KlearNowGenericRouteWorkspaceProps): React.ReactElement => {
  return (
    <Box padding="spacing.6" minHeight="100%">
      <Heading size="large" weight="semibold">
        {pathname.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g, ' ') ?? 'Page'}
      </Heading>
      <Text marginTop="spacing.2" color="surface.text.gray.subtle">
        Active route: {pathname}
      </Text>
    </Box>
  );
};

const isKlearNowTransactionRoute = (pathname: string): boolean => {
  return pathname.includes('/transactions');
};

type KlearNowAppShellMainWorkspaceProps = {
  pathname: string;
};

const KlearNowAppShellMainWorkspace = ({
  pathname,
}: KlearNowAppShellMainWorkspaceProps): React.ReactElement => {
  if (pathname === '/dashboard') {
    return <KlearNowDashboardHomeWorkspace />;
  }
  if (isKlearNowTransactionRoute(pathname)) {
    return <KlearNowTransactionManagerWorkspace />;
  }
  return <KlearNowGenericRouteWorkspace pathname={pathname} />;
};

export {
  KlearNowAppShellMainWorkspace,
  KlearNowDashboardHomeWorkspace,
  KlearNowGenericRouteWorkspace,
  KlearNowTransactionManagerWorkspace,
};
