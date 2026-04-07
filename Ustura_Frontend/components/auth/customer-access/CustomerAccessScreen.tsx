import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { resolveCustomerAuthRedirect, type CustomerAuthRedirectParams } from '@/components/auth/customer-access/navigation';
import CustomerAccessFormCard from '@/components/auth/customer-access/CustomerAccessFormCard';
import CustomerAccessShell from '@/components/auth/customer-access/CustomerAccessShell';
import { useCustomerAccess } from '@/components/auth/customer-access/use-customer-access';
import { useAuth } from '@/hooks/use-auth';
import { useWindowDimensions } from 'react-native';

export default function CustomerAccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<CustomerAuthRedirectParams>();
  const { login } = useAuth();
  const access = useCustomerAccess({
    onSubmitSuccess: ({ identifier, password }) => {
      const sessionUser = login({ identifier, password });

      if (sessionUser == null) {
        return false;
      }

      router.replace(resolveCustomerAuthRedirect(params));
      return true;
    },
  });
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
