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
  const params = useLocalSearchParams() as CustomerAuthRedirectParams;
  const { login, loginWithGoogle, isGoogleLoginLoading } = useAuth();
  const access = useCustomerAccess({
    onSubmitSuccess: async ({ identifier, password }) => {
      await login({ identifier, password });

      router.replace(resolveCustomerAuthRedirect(params));
      return true;
    },
    onGoogleSubmitSuccess: async () => {
      await loginWithGoogle();

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
        submitLabel={access.isSubmitting ? 'Giris Yapiliyor' : 'Giris Yap'}
        submitDisabled={access.isSubmitting || access.isGoogleSubmitting}
        identifierError={access.fieldErrors.identifier}
        passwordError={access.fieldErrors.password}
        onIdentifierChange={access.handleIdentifierChange}
        onPasswordChange={access.handlePasswordChange}
        onToggleRememberMe={access.toggleRememberMe}
        onForgotPassword={access.handleForgotPassword}
        onSubmit={() => {
          void access.handleSubmit();
        }}
        googleAccessLabel={
          access.isGoogleSubmitting
            ? 'Google ile giris yapiliyor'
            : isGoogleLoginLoading
              ? 'Google hazirlaniyor'
              : 'Google ile giris yap'
        }
        googleAccessDisabled={
          access.isSubmitting || access.isGoogleSubmitting || isGoogleLoginLoading
        }
        onGoogleAccess={() => {
          void access.handleGoogleAccess();
        }}
        onRegisterPress={() => router.push('/kayit')}
      />
    </CustomerAccessShell>
  );
}
