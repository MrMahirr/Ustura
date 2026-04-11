import React from 'react';

import type {
  PackageApprovalCounts,
  PackageApprovalRecord,
  PackageApprovalStatus,
} from './types';

function createCounts(records: PackageApprovalRecord[]): PackageApprovalCounts {
  return records.reduce<PackageApprovalCounts>(
    (accumulator, record) => {
      accumulator[record.status] += 1;
      return accumulator;
    },
    { pending: 0, approved: 0, rejected: 0 },
  );
}

function matchesQuery(record: PackageApprovalRecord, query: string) {
  const lowerQuery = query.toLocaleLowerCase('tr-TR');

  return (
    record.salonName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
    record.ownerName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
    record.packageName.toLocaleLowerCase('tr-TR').includes(lowerQuery) ||
    record.city.toLocaleLowerCase('tr-TR').includes(lowerQuery)
  );
}

export function usePackageApprovalManagement(
  query: string,
  records: PackageApprovalRecord[],
) {
  const [activeStatus, setActiveStatus] =
    React.useState<PackageApprovalStatus>('pending');
  const [selectedRecordId, setSelectedRecordId] = React.useState<string | null>(
    records[0]?.id ?? null,
  );
  const deferredQuery = React.useDeferredValue(query);

  const counts = React.useMemo(() => createCounts(records), [records]);

  const filteredRecords = React.useMemo(() => {
    return records.filter((record) => {
      if (record.status !== activeStatus) {
        return false;
      }

      if (!deferredQuery.trim()) {
        return true;
      }

      return matchesQuery(record, deferredQuery);
    });
  }, [activeStatus, deferredQuery, records]);

  React.useEffect(() => {
    if (
      selectedRecordId &&
      filteredRecords.some((record) => record.id === selectedRecordId)
    ) {
      return;
    }

    setSelectedRecordId(filteredRecords[0]?.id ?? null);
  }, [filteredRecords, selectedRecordId]);

  const selectedRecord = React.useMemo(
    () =>
      filteredRecords.find((record) => record.id === selectedRecordId) ??
      filteredRecords[0] ??
      null,
    [filteredRecords, selectedRecordId],
  );

  return {
    activeStatus,
    setActiveStatus,
    counts,
    filteredRecords,
    selectedRecord,
    selectedRecordId,
    setSelectedRecordId,
  };
}
