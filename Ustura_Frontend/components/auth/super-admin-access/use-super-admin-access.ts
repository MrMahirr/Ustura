import React from 'react';

import {
  getSuperAdminAccessMessage,
  type SuperAdminAccessState,
} from '@/components/auth/super-admin-access/presentation';

interface FieldErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = 'Admin email alanı zorunludur.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Geçerli bir email formatı gir.';
  }

  if (!password.trim()) {
    errors.password = 'Şifre alanı zorunludur.';
  } else if (password.trim().length < 8) {
    errors.password = 'Test akışı için en az 8 karakter kullan.';
  }

  return errors;
}

function clearFieldError(errors: FieldErrors, field: keyof FieldErrors): FieldErrors {
  if (!errors[field]) {
    return errors;
  }

  return { ...errors, [field]: undefined };
}

export function useSuperAdminAccess() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [trustedDevice, setTrustedDevice] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<SuperAdminAccessState>('idle');

  const handleEmailChange = React.useCallback(
    (value: string) => {
      setEmail(value);
      setFieldErrors((previous) => clearFieldError(previous, 'email'));

      if (state !== 'idle') {
        setState('idle');
      }
    },
    [state]
  );

  const handlePasswordChange = React.useCallback(
    (value: string) => {
      setPassword(value);
      setFieldErrors((previous) => clearFieldError(previous, 'password'));

      if (state !== 'idle') {
        setState('idle');
      }
    },
    [state]
  );

  const toggleTrustedDevice = React.useCallback(() => {
    setTrustedDevice((previous) => !previous);
  }, []);

  const handleForgotPassword = React.useCallback(() => {
    setState('forgotPassword');
  }, []);

  const handleSystemStatusPress = React.useCallback(() => {
    setState('systemStatus');
  }, []);

  const handleSubmit = React.useCallback(() => {
    const nextErrors = validateFields(email, password);
    setFieldErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      setState('validationError');
      return;
    }

    // Backend auth intentionally stays disconnected until the API contract exists.
    setState('testReady');
  }, [email, password]);

  const message = React.useMemo(() => getSuperAdminAccessMessage(state, trustedDevice), [state, trustedDevice]);

  return {
    email,
    password,
    trustedDevice,
    fieldErrors,
    message,
    handleEmailChange,
    handlePasswordChange,
    toggleTrustedDevice,
    handleForgotPassword,
    handleSystemStatusPress,
    handleSubmit,
  };
}
