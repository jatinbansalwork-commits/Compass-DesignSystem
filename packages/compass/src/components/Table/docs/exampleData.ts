import type { TableData } from '../types';
import type { BadgeProps } from '~components/Badge';

type TableExampleItem = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
  type: string;
  method: string;
  account: string;
  name: string;
  broker: string;
  entryNumber: string;
  portOfEntry: string;
  countryOfOrigin: string;
  invoiceValue: number;
  cbpTransactionId: string;
  carrierReference: string;
  isfStatus: string;
  lastUpdated: Date;
  assignedAnalyst: string;
  pgaHold: string;
};

const statuses = ['Released', 'Exam hold', 'Rejected', 'Pending CBP review'];
const types = ['Formal entry', 'Consumption entry', 'Temporary import'];
const methods = ['Ocean', 'Air', 'Truck'];
const brokers = [
  'Meridian Customs Brokers',
  'Pacific Rim Brokerage',
  'Harborline Customs',
  'Northstar CHB',
  'Summit Trade Compliance',
];

const portsOfEntry = ['Los Angeles', 'Long Beach', 'Newark', 'Savannah', 'Houston', 'Seattle'];
const countriesOfOrigin = ['China', 'India', 'Vietnam', 'Mexico', 'Germany', 'South Korea'];
const isfStatuses = ['Matched', 'Not filed', 'Amended', 'On hold'];
const analysts = ['J. Patel', 'M. Chen', 'A. Rivera', 'S. Okonkwo', 'L. Kim'];
const pgaHoldLabels = ['None', 'FDA review', 'EPA hold', 'USDA inspect'];
const vesselRefs = ['EVER GIVEN', 'MSC OSCAR', 'MAERSK SEALAND', 'COSCO UNISON', 'ONE HAMBURG'];

const names = [
  'Schlumberger USA Inc.',
  'BASF Agricultural Solutions',
  'Pacific Rim Trading Co.',
  'Meridian Customs Brokers',
  'Harborline Imports LLC',
  'Northstar Freight Partners',
  'Atlas Global Logistics',
  'Summit Trade Compliance',
];

const htsCodes = [
  '8471.30.0100',
  '2933.99.8200',
  '8703.23.0190',
  '4011.10.1000',
  '7304.59.6000',
  '8542.31.0075',
  '3004.90.9290',
  '9403.60.8081',
];

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const createTableNodes = (count: number): TableExampleItem[] =>
  Array.from({ length: count }, (_, index) => {
    const entryDate = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    );
    return {
      id: (index + 1).toString(),
      paymentId: `KX-${String(100000 + index + Math.floor(Math.random() * 900)).padStart(6, '0')}`,
      amount: Number((Math.random() * 85000 + 500).toFixed(2)),
      date: entryDate,
      status: pickRandom(statuses),
      type: pickRandom(types),
      method: pickRandom(methods),
      account: pickRandom(htsCodes),
      name: pickRandom(names),
      broker: pickRandom(brokers),
      entryNumber: `ENT-${String(2400000 + index + Math.floor(Math.random() * 500))}`,
      portOfEntry: pickRandom(portsOfEntry),
      countryOfOrigin: pickRandom(countriesOfOrigin),
      invoiceValue: Number((Math.random() * 420000 + 12000).toFixed(2)),
      cbpTransactionId: `CBP-${Math.floor(Math.random() * 900000 + 100000)}`,
      carrierReference: pickRandom(vesselRefs),
      isfStatus: pickRandom(isfStatuses),
      lastUpdated: new Date(
        entryDate.getTime() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000,
      ),
      assignedAnalyst: pickRandom(analysts),
      pgaHold: pickRandom(pgaHoldLabels),
    };
  });

const createTableData = (count: number): TableData<TableExampleItem> => ({
  nodes: createTableNodes(count),
});

const getStatusColor = (status: string): BadgeProps['color'] => {
  const normalized = status.toLowerCase();
  if (normalized === 'released') return 'positive';
  if (normalized === 'exam hold' || normalized === 'pending cbp review') return 'notice';
  if (normalized === 'rejected') return 'negative';
  return 'primary';
};

const formatDate = (date: Date | undefined): string | undefined =>
  date?.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

type TransactionTableItem = {
  id: string;
  transactionId: string;
  companyName: string;
  cbpTransactionNumber: string;
  username: string;
  transactionState: string;
  etd: Date;
  vesselName: string;
  filingDate: Date;
  shipmentNumber: string;
  mbl: string;
  hbl: string;
  countryOfExport: string;
};

const transactionStates = ['SENT', 'IN PROCESS', 'REJECTED', 'NEW', 'RETRANSMIT', 'ACCEPTED'];
const companyNames = [
  'Schlumberger USA Inc.',
  'BASF Agricultural Solutions',
  'Pacific Rim Trading Co.',
  'Meridian Customs Brokers',
];
const vesselNames = ['EVER GIVEN', 'MSC OSCAR', 'COSCO SHIPPING UNISON', 'MAERSK SEALAND'];
const usernames = ['jbroker', 'adoe_filings', 'pacific_rim_ops', 'schlumberger_entry'];
const countries = ['China', 'India', 'Vietnam', 'South Korea', 'Germany'];

const randomDate = (): Date =>
  new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

const createTransactionTableNodes = (count: number): TransactionTableItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    transactionId: `ENT-${String(2400000 + index)}`,
    companyName: pickRandom(companyNames),
    cbpTransactionNumber: `CBP-${Math.floor(Math.random() * 900000 + 100000)}`,
    username: pickRandom(usernames),
    transactionState: pickRandom(transactionStates),
    etd: randomDate(),
    vesselName: pickRandom(vesselNames),
    filingDate: randomDate(),
    shipmentNumber: `KX-${String(100000 + index).padStart(6, '0')}`,
    mbl: `MBL${Math.floor(Math.random() * 9000000 + 1000000)}`,
    hbl: `HBL${Math.floor(Math.random() * 9000000 + 1000000)}`,
    countryOfExport: pickRandom(countries),
  }));

const createTransactionTableData = (count: number): TableData<TransactionTableItem> => ({
  nodes: createTransactionTableNodes(count),
});

const getTransactionStateColor = (state: string): BadgeProps['color'] => {
  const normalized = state.toUpperCase();
  if (normalized === 'ACCEPTED' || normalized === 'SENT') {
    return 'positive';
  }
  if (normalized === 'IN PROCESS' || normalized === 'NEW' || normalized === 'RETRANSMIT') {
    return 'notice';
  }
  if (normalized === 'REJECTED') {
    return 'negative';
  }
  return 'primary';
};

export {
  createTableNodes,
  createTableData,
  getStatusColor,
  formatDate,
  createTransactionTableData,
  getTransactionStateColor,
};
export type { TableExampleItem, TransactionTableItem };
