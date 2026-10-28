import React from 'react';
import { EmptyState } from '~components/EmptyState';
import type { TableExperienceEmptyCopy, TableExperienceEmptyReason } from './types';

type TableExperienceEmptyProps = TableExperienceEmptyCopy & {
  reason: TableExperienceEmptyReason;
};

const defaultCopy: Record<TableExperienceEmptyReason, { title: string; description: string }> = {
  'no-data': {
    title: 'No records yet',
    description: 'When data is available, it will appear in this table.',
  },
  'no-results': {
    title: 'No matching results',
    description: 'Try adjusting your search or column filters.',
  },
};

const TableExperienceEmpty = ({
  reason,
  noDataTitle,
  noDataDescription,
  noResultsTitle,
  noResultsDescription,
}: TableExperienceEmptyProps): React.ReactElement => {
  const defaults = defaultCopy[reason];
  const title =
    reason === 'no-data'
      ? (noDataTitle ?? defaults.title)
      : (noResultsTitle ?? defaults.title);
  const description =
    reason === 'no-data'
      ? (noDataDescription ?? defaults.description)
      : (noResultsDescription ?? defaults.description);

  return (
    <EmptyState title={title} description={description} size="medium" testID="table-experience-empty" />
  );
};

export { TableExperienceEmpty };
