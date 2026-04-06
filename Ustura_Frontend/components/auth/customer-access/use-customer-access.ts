import React from 'react';

import {
  getCustomerAccessNotice,
  type CustomerAccessState,
} from '@/components/auth/customer-access/presentation';

interface FieldErrors {
  identifier?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Email veya telefon alani zorunludur.';
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

function clearFieldError(errors: FieldErrors, field: keyof FieldErrors): FieldErrors {
  if (!errors[field]) {
    return errors;
  }

  return { ...errors, [field]: undefined };
}

export function useCustomerAccess() {
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<CustomerAccessState>('idle');

  const resetToIdle = React.useCallback(() => {
    if (state !== 'idle') {
      setState('idle');
    }
  }, [state]);

  const handleIdentifierChange = React.useCallback(
    (value: string) => {
      setIdentifier(value);
      setFieldErrors((previous) => clearFieldError(previous, 'identifier'));
      resetToIdle();
    },
    [resetToIdle]
  );

  const handlePasswordChange = React.useCallback(
    (value: string) => {
      setPassword(value);
      setFieldErrors((previous) => clearFieldError(previous, 'password'));
      resetToIdle();
    },
    [resetToIdle]
  );

  const toggleRememberMe = React.useCallback(() => {
    setRememberMe((previous) => !previous);
  }, []);

  const handleForgotPassword = React.useCallback(() => {
    setState('forgotPassword');
  }, []);

  const handleGoogleAccess = React.useCallback(() => {
    setState('providerPreview');
  }, []);

  const handleSubmit = React.useCallback(() => {
    const nextErrors: FieldErrors = {
      identifier: validateIdentifier(identifier),
      password: validatePassword(password),
    };

    setFieldErrors(nextErrors);

    if (nextErrors.identifier || nextErrors.password) {
      setState('validationError');
      return;
    }

    setState('testReady');
  }, [identifier, password]);

  const notice = React.useMemo(() => getCustomerAccessNotice(state), [state]);

  return {
    state,
    identifier,
    password,
    rememberMe,
    fieldErrors,
    notice,
    handleIdentifierChange,
    handlePasswordChange,
    toggleRememberMe,
    handleForgotPassword,
    handleGoogleAccess,
    handleSubmit,
  };
}
