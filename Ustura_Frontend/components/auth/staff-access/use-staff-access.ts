import React from 'react';

import {
  STAFF_SALON_OPTIONS,
  getStaffAccessNotice,
  type StaffAccessState,
} from '@/components/auth/staff-access/presentation';

interface FieldErrors {
  identifier?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Telefon veya email alani zorunludur.';
  }

  if (trimmed.includes('@')) {
    return EMAIL_PATTERN.test(trimmed) ? undefined : 'Gecerli bir email adresi gir.';
  }

  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 10 ? undefined : 'Gecerli bir telefon numarasi gir.';
}

function validatePassword(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Sifre alani zorunludur.';
  }

  return trimmed.length >= 8 ? undefined : 'Test akisi icin en az 8 karakter kullan.';
}

export function useStaffAccess() {
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [selectedSalonId, setSelectedSalonId] = React.useState(STAFF_SALON_OPTIONS[0]?.id ?? '');
  const [isSalonModalOpen, setIsSalonModalOpen] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<StaffAccessState>('idle');

  const selectedSalon =
    STAFF_SALON_OPTIONS.find((option) => option.id === selectedSalonId) ?? STAFF_SALON_OPTIONS[0];

  const resetToIdle = React.useCallback(() => {
    if (state !== 'idle') {
      setState('idle');
    }
  }, [state]);

  const handleIdentifierChange = React.useCallback(
    (value: string) => {
      setIdentifier(value);
      setFieldErrors((previous) => ({ ...previous, identifier: undefined }));
      resetToIdle();
    },
    [resetToIdle]
  );

  const handlePasswordChange = React.useCallback(
    (value: string) => {
      setPassword(value);
      setFieldErrors((previous) => ({ ...previous, password: undefined }));
      resetToIdle();
    },
    [resetToIdle]
  );

  const toggleRememberMe = React.useCallback(() => {
    setRememberMe((previous) => !previous);
  }, []);

  const openSalonModal = React.useCallback(() => {
    setIsSalonModalOpen(true);
  }, []);

  const closeSalonModal = React.useCallback(() => {
    setIsSalonModalOpen(false);
  }, []);

  const handleSalonSelect = React.useCallback(
    (salonId: string) => {
      setSelectedSalonId(salonId);
      setIsSalonModalOpen(false);
      resetToIdle();
    },
    [resetToIdle]
  );

  const handleForgotPassword = React.useCallback(() => {
    setState('forgotPassword');
  }, []);

  const handleSubmit = React.useCallback(() => {
    const nextErrors: FieldErrors = {
      identifier: validateIdentifier(identifier),
      password: validatePassword(password),
    };

    setFieldErrors(nextErrors);

    if (nextErrors.identifier || nextErrors.password || !selectedSalonId) {
      setState('validationError');
      return;
    }

    setState('testReady');
  }, [identifier, password, selectedSalonId]);

  const notice = React.useMemo(
    () => getStaffAccessNotice(state, selectedSalon?.label ?? 'Secili salon'),
    [selectedSalon?.label, state]
  );

  return {
    identifier,
    password,
    rememberMe,
    selectedSalon,
    salonOptions: STAFF_SALON_OPTIONS,
    isSalonModalOpen,
    fieldErrors,
    notice,
    handleIdentifierChange,
    handlePasswordChange,
    toggleRememberMe,
    openSalonModal,
    closeSalonModal,
    handleSalonSelect,
    handleForgotPassword,
    handleSubmit,
  };
}
