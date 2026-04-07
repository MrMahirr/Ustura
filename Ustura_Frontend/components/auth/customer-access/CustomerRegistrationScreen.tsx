import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';

import { resolveCustomerAuthRedirect, type CustomerAuthRedirectParams } from '@/components/auth/customer-access/navigation';
import CustomerAccessShell from '@/components/auth/customer-access/CustomerAccessShell';
import CustomerRegistrationFormCard from '@/components/auth/customer-access/CustomerRegistrationFormCard';
import CustomerRoleModal from '@/components/auth/customer-access/CustomerRoleModal';
import { useCustomerRegistration } from '@/components/auth/customer-access/use-customer-registration';
import { useAuth } from '@/hooks/use-auth';

export default function CustomerRegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<CustomerAuthRedirectParams>();
  const { register } = useAuth();
  const registration = useCustomerRegistration({
    onSubmitSuccess: ({ fullName, phone, email, password }) => {
      register({ fullName, phone, email, password });
      router.replace(resolveCustomerAuthRedirect(params));
    },
  });
  const { width } = useWindowDimensions();
  const isCompact = width < 480;

  return (
    <CustomerAccessShell>
      <CustomerRegistrationFormCard
        compact={isCompact}
        showNotice={registration.state !== 'idle'}
        notice={registration.notice}
        fullName={registration.fullName}
        phone={registration.phone}
        email={registration.email}
        password={registration.password}
        selectedRoleLabel={registration.selectedRole.label}
        fullNameError={registration.fieldErrors.fullName}
        phoneError={registration.fieldErrors.phone}
        emailError={registration.fieldErrors.email}
        passwordError={registration.fieldErrors.password}
        roleError={registration.fieldErrors.role}
        onFullNameChange={registration.handleFullNameChange}
        onPhoneChange={registration.handlePhoneChange}
        onEmailChange={registration.handleEmailChange}
        onPasswordChange={registration.handlePasswordChange}
        onOpenRoleModal={registration.openRoleModal}
        onSubmit={registration.handleSubmit}
        onSignInPress={() => router.push('/giris')}
      />

      <CustomerRoleModal
        visible={registration.isRoleModalOpen}
        options={registration.roleOptions}
        selectedRoleId={registration.selectedRole.id}
        onClose={registration.closeRoleModal}
        onSelect={registration.handleRoleSelect}
      />
    </CustomerAccessShell>
  );
}
