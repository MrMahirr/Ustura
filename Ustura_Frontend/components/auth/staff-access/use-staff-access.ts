import React from 'react';

import {
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
    return 'Telefon veya e-posta alani zorunludur.';
  }

  if (trimmed.includes('@')) {
    return EMAIL_PATTERN.test(trimmed) ? undefined : 'Gecerli bir e-posta adresi gir.';
  }

  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 10 ? undefined : 'Gecerli bir telefon numarasi gir.';
}

function validatePassword(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Sifre alani zorunludur.';
  }

  return trimmed.length >= 8 ? undefined : 'En az 8 karakter kullan.';
}

function clearFieldError(errors: FieldErrors, field: keyof FieldErrors): FieldErrors {
  if (!errors[field]) {
    return errors;
  }

  return { ...errors, [field]: undefined };
}

interface UseStaffAccessOptions {
  initialIdentifier?: string;
  onSubmitSuccess?: (payload: {
    identifier: string;
    password: string;
  }) => Promise<boolean>;
}

export function useStaffAccess(options: UseStaffAccessOptions = {}) {
  const [identifier, setIdentifier] = React.useState(
    options.initialIdentifier ?? '',
  );
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<StaffAccessState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = React.useState<string | null>(null);

  const resetToIdle = React.useCallback(() => {
    if (state !== 'idle') {
      setState('idle');
    }
  }, [state]);

  const handleIdentifierChange = React.useCallback(
    (value: string) => {
      setIdentifier(value);
      setFieldErrors((previous) => clearFieldError(previous, 'identifier'));
      setRequestErrorMessage(null);
      resetToIdle();
    },
    [resetToIdle],
  );

  const handlePasswordChange = React.useCallback(
    (value: string) => {
      setPassword(value);
      setFieldErrors((previous) => clearFieldError(previous, 'password'));
      setRequestErrorMessage(null);
      resetToIdle();
    },
    [resetToIdle],
  );

  const toggleRememberMe = React.useCallback(() => {
    setRememberMe((previous) => !previous);
  }, []);

  const handleForgotPassword = React.useCallback(() => {
    setState('forgotPassword');
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedIdentifier = identifier.trim();
    const normalizedPassword = password.trim();
    const nextErrors: FieldErrors = {
      identifier: validateIdentifier(normalizedIdentifier),
      password: validatePassword(normalizedPassword),
    };

    setFieldErrors(nextErrors);

    if (nextErrors.identifier || nextErrors.password) {
      setState('validationError');
      return;
    }

    setIsSubmitting(true);
    setRequestErrorMessage(null);
    setState('authorizing');

    try {
      const didLogin = await options.onSubmitSuccess?.({
        identifier: normalizedIdentifier,
        password: normalizedPassword,
      });

      if (didLogin === false) {
        setFieldErrors({
          identifier: undefined,
          password: 'E-posta veya sifre hatali.',
        });
        setState('invalidCredentials');
        return;
      }

      setState('accessGranted');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Personel girisi tamamlanamadi.';
      setRequestErrorMessage(message);
      setState('requestError');
    } finally {
      setIsSubmitting(false);
    }
  }, [identifier, isSubmitting, options, password]);

  const notice = React.useMemo(() => {
    if (state === 'requestError' && requestErrorMessage) {
      return {
        ...getStaffAccessNotice(state),
        description: requestErrorMessage,
      };
    }

    return getStaffAccessNotice(state);
  }, [requestErrorMessage, state]);

  return {
    identifier,
    password,
    rememberMe,
    fieldErrors,
    notice,
    isSubmitting,
    handleIdentifierChange,
    handlePasswordChange,
    toggleRememberMe,
    handleForgotPassword,
    handleSubmit,
  };
}
