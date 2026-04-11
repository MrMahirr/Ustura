import React from 'react';

import {
  CUSTOMER_ROLE_OPTIONS,
  getCustomerRegistrationNotice,
  type CustomerRegistrationState,
  type CustomerRoleOption,
} from '@/components/auth/customer-access/presentation';

interface FieldErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFullName(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Ad soyad alani zorunludur.';
  }

  return trimmed.length >= 4 ? undefined : 'En az ad ve soyad girecek kadar bilgi ekle.';
}

function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return 'Telefon alani zorunludur.';
  }

  return digits.length >= 10 ? undefined : 'Gecerli bir telefon numarasi gir.';
}

function validateEmail(value: string): string | undefined {
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

interface UseCustomerRegistrationOptions {
  onSubmitSuccess?: (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export function useCustomerRegistration(options: UseCustomerRegistrationOptions = {}) {
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedRoleId, setSelectedRoleId] = React.useState<CustomerRoleOption['id']>('customer');
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, setState] = React.useState<CustomerRegistrationState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [requestErrorMessage, setRequestErrorMessage] = React.useState<string | null>(null);

  const selectedRole =
    CUSTOMER_ROLE_OPTIONS.find((option) => option.id === selectedRoleId) ?? CUSTOMER_ROLE_OPTIONS[0];

  const resetToIdle = React.useCallback(() => {
    if (state !== 'idle') {
      setState('idle');
    }
  }, [state]);

  const handleFullNameChange = React.useCallback(
    (value: string) => {
      setFullName(value);
      setFieldErrors((previous) => clearFieldError(previous, 'fullName'));
      setRequestErrorMessage(null);
      resetToIdle();
    },
    [resetToIdle]
  );

  const handlePhoneChange = React.useCallback(
    (value: string) => {
      setPhone(value);
      setFieldErrors((previous) => clearFieldError(previous, 'phone'));
      setRequestErrorMessage(null);
      resetToIdle();
    },
    [resetToIdle]
  );

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

  const openRoleModal = React.useCallback(() => {
    setIsRoleModalOpen(true);
  }, []);

  const closeRoleModal = React.useCallback(() => {
    setIsRoleModalOpen(false);
  }, []);

  const handleRoleSelect = React.useCallback(
    (roleId: CustomerRoleOption['id']) => {
      setSelectedRoleId(roleId);
      setIsRoleModalOpen(false);
      setFieldErrors((previous) => clearFieldError(previous, 'role'));
      resetToIdle();
    },
    [resetToIdle]
  );

  const handleSubmit = React.useCallback(async () => {
    const nextErrors: FieldErrors = {
      fullName: validateFullName(fullName),
      phone: validatePhone(phone),
      email: validateEmail(email),
      password: validatePassword(password),
      role: selectedRoleId ? undefined : 'Bir hesap tipi sec.',
    };

    setFieldErrors(nextErrors);

    if (nextErrors.fullName || nextErrors.phone || nextErrors.email || nextErrors.password || nextErrors.role) {
      setState('validationError');
      return;
    }

    if (selectedRoleId !== 'customer') {
      setState('alternateRoute');
      return;
    }

    setIsSubmitting(true);
    setRequestErrorMessage(null);

    try {
      await options.onSubmitSuccess?.({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      setState('testReady');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Kayit istegi tamamlanamadi.';
      setRequestErrorMessage(message);
      setState('requestError');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, fullName, options, password, phone, selectedRoleId]);

  const notice = React.useMemo(() => {
    if (state !== 'requestError' || !requestErrorMessage) {
      return getCustomerRegistrationNotice(state, selectedRole);
    }

    return {
      ...getCustomerRegistrationNotice(state, selectedRole),
      description: requestErrorMessage,
    };
  }, [requestErrorMessage, selectedRole, state]);

  return {
    state,
    isSubmitting,
    fullName,
    phone,
    email,
    password,
    selectedRole,
    roleOptions: CUSTOMER_ROLE_OPTIONS,
    isRoleModalOpen,
    fieldErrors,
    notice,
    handleFullNameChange,
    handlePhoneChange,
    handleEmailChange,
    handlePasswordChange,
    openRoleModal,
    closeRoleModal,
    handleRoleSelect,
    handleSubmit,
  };
}
