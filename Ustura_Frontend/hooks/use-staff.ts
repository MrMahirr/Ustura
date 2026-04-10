import React from 'react';

import { getStaffBySalon, type StaffRecord } from '@/services/staff.service';

export function useStaffBySalonId(salonId?: string | null) {
  const [staffMembers, setStaffMembers] = React.useState<StaffRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(Boolean(salonId));
  const [error, setError] = React.useState<string | null>(null);

  const loadStaff = React.useCallback(async () => {
    if (!salonId) {
      setStaffMembers([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const nextStaffMembers = await getStaffBySalon(salonId);
      setStaffMembers(nextStaffMembers);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Salon personeli yuklenemedi.',
      );
      setStaffMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [salonId]);

  React.useEffect(() => {
    let isActive = true;

    if (!salonId) {
      setStaffMembers([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextStaffMembers = await getStaffBySalon(salonId);

        if (!isActive) {
          return;
        }

        setStaffMembers(nextStaffMembers);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Salon personeli yuklenemedi.',
        );
        setStaffMembers([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isActive = false;
    };
  }, [salonId]);

  return {
    staffMembers,
    isLoading,
    error,
    reload: loadStaff,
  };
}
