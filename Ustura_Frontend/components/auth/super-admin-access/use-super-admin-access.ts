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
    errors.email = 'Yonetici e-posta alani zorunludur.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Gecerli bir e-posta bicimi gir.';
  }

  if (!password.trim()) {
    errors.password = 'Sifre alani zorunludur.';
  } else if (password.trim().length < 8) {
    errors.password = 'En az 8 karakter kullan.';
  }

  return errors;
}

function clearFieldError(errors: FieldErrors, field: keyof FieldErrors): FieldErrors {
  if (!errors[field]) {
    return errors;
  }

  return { ...errors, [field]: undefined };
}

interface UseSuperAdminAccessOptions {
  onSubmitSuccess?: (payload: {
    email: string;
    password: string;
    trustedDevice: boolean;
  }) => Promise<boolean>;
}

export function useSuperAdminAccess(options: UseSuperAdminAccessOptions = {}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [trustedDevice, setTrustedDevice] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<SuperAdminAccessState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = React.useState<string | null>(null);

  const resetToIdle = React.useCallback(() => {
    if (state !== 'idle') {
      setState('idle');
    }
  }, [state]);

  const handleEmailChange = React.useCallback(
    (value: string) => {
      setEmail(value);
      setFieldErrors((previous) => clearFieldError(previous, 'email'));
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

  const toggleTrustedDevice = React.useCallback(() => {
    setTrustedDevice((previous) => !previous);
  }, []);

  const handleForgotPassword = React.useCallback(() => {
    setState('forgotPassword');
  }, []);

  const handleSystemStatusPress = React.useCallback(() => {
    setState('systemStatus');
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors = validateFields(email, password);
    setFieldErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      setState('validationError');
      return;
    }

    setIsSubmitting(true);
    setRequestErrorMessage(null);
    setState('authorizing');

    try {
      const didLogin = await options.onSubmitSuccess?.({
        email: email.trim(),
        password: password.trim(),
        trustedDevice,
      });

      if (didLogin === false) {
        setRequestErrorMessage('Super-admin girisi tamamlanamadi.');
        setState('requestError');
        return;
      }

      setState('accessGranted');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Super-admin girisi tamamlanamadi.';
      setRequestErrorMessage(message);
      setState('requestError');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isSubmitting, options, password, trustedDevice]);

  const message = React.useMemo(() => {
    if (state !== 'requestError' || !requestErrorMessage) {
      return getSuperAdminAccessMessage(state, trustedDevice);
    }

    return {
      ...getSuperAdminAccessMessage(state, trustedDevice),
      description: requestErrorMessage,
    };
  }, [requestErrorMessage, state, trustedDevice]);

  return {
    email,
    password,
    trustedDevice,
    fieldErrors,
    message,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    toggleTrustedDevice,
    handleForgotPassword,
    handleSystemStatusPress,
    handleSubmit,
  };
}
