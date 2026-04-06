import { useRouter } from 'expo-router';
import React from 'react';

import CustomerAccessFormCard from '@/components/auth/customer-access/CustomerAccessFormCard';
import CustomerAccessShell from '@/components/auth/customer-access/CustomerAccessShell';
import { useCustomerAccess } from '@/components/auth/customer-access/use-customer-access';
import { useWindowDimensions } from 'react-native';

export default function CustomerAccessScreen() {
  const router = useRouter();
  const access = useCustomerAccess();
  const { width } = useWindowDimensions();

  const isCompact = width < 480;

  return (
    <CustomerAccessShell>
      <CustomerAccessFormCard
        compact={isCompact}
        state={access.state}
        notice={access.notice}
        identifier={access.identifier}
        password={access.password}
        rememberMe={access.rememberMe}
        identifierError={access.fieldErrors.identifier}
        passwordError={access.fieldErrors.password}
        onIdentifierChange={access.handleIdentifierChange}
        onPasswordChange={access.handlePasswordChange}
        onToggleRememberMe={access.toggleRememberMe}
        onForgotPassword={access.handleForgotPassword}
        onSubmit={access.handleSubmit}
        onGoogleAccess={access.handleGoogleAccess}
        onRegisterPress={() => router.push('/kayit')}
      />
    </CustomerAccessShell>
  );
}
