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
    return 'E-posta alani zorunludur.';
  }

  return EMAIL_PATTERN.test(trimmed) ? undefined : 'Gecerli bir e-posta adresi gir.';
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

interface UseCustomerAccessOptions {
  onSubmitSuccess?: (payload: {
    identifier: string;
    password: string;
  }) => Promise<boolean>;
  onGoogleSubmitSuccess?: () => Promise<boolean>;
}

export function useCustomerAccess(options: UseCustomerAccessOptions = {}) {
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<CustomerAccessState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);
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
    [resetToIdle]
  );

  const handlePasswordChange = React.useCallback(
    (value: string) => {
      setPassword(value);
      setFieldErrors((previous) => clearFieldError(previous, 'password'));
      setRequestErrorMessage(null);
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

  const handleGoogleAccess = React.useCallback(async () => {
    if (isSubmitting || isGoogleSubmitting) {
      return;
    }

    setIsGoogleSubmitting(true);
    setRequestErrorMessage(null);

    try {
      if (!options.onGoogleSubmitSuccess) {
        throw new Error('Google girisi henuz baglanmadi.');
      }

      const didLogin = await options.onGoogleSubmitSuccess();

      if (didLogin === false) {
        setRequestErrorMessage('Google hesabi ile giris tamamlanamadi.');
        setState('requestError');
        return;
      }

      setState('testReady');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Google ile giris tamamlanamadi.';
      setRequestErrorMessage(message);
      setState('requestError');
    } finally {
      setIsGoogleSubmitting(false);
    }
  }, [isGoogleSubmitting, isSubmitting, options]);

  const handleSubmit = React.useCallback(async () => {
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

      setState('testReady');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Giris istegi tamamlanamadi.';
      setRequestErrorMessage(message);
      setState('requestError');
    } finally {
      setIsSubmitting(false);
    }
  }, [identifier, options, password]);

  const notice = React.useMemo(() => {
    if (state !== 'requestError' || !requestErrorMessage) {
      return getCustomerAccessNotice(state);
    }

    return {
      ...getCustomerAccessNotice(state),
      description: requestErrorMessage,
    };
  }, [requestErrorMessage, state]);

  return {
    state,
    isSubmitting,
    isGoogleSubmitting,
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
