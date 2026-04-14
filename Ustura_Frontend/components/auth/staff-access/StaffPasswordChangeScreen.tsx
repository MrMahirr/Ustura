import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import AuthCredentialField from '@/components/auth/shared/AuthCredentialField';
import AuthPageFrame from '@/components/auth/shared/AuthPageFrame';
import { useAuthAccessTheme } from '@/components/auth/shared/use-auth-access-theme';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/use-auth';
import { hexToRgba } from '@/utils/color';

const STAFF_ROLES = ['owner', 'barber', 'receptionist'] as const;

export default function StaffPasswordChangeScreen() {
  const theme = useAuthAccessTheme();
  const router = useRouter();
  const {
    isAuthenticated,
    role,
    mustChangePassword,
    submitPasswordChange,
    logout,
  } = useAuth();

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isStaffRole =
    role != null && STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number]);

  if (!isAuthenticated || !isStaffRole) {
    return <Redirect href="/personel/giris" />;
  }

  if (!mustChangePassword) {
    return <Redirect href="/berber" />;
  }

  const handleSubmit = async () => {
    setErrorMessage(null);
    const cur = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (cur.length < 1) {
      setErrorMessage('Mevcut sifrenizi girin.');
      return;
    }
    if (next.length < 8) {
      setErrorMessage('Yeni sifre en az 8 karakter olmalidir.');
      return;
    }
    if (next !== confirm) {
      setErrorMessage('Yeni sifre ile tekrar ayni degil.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPasswordChange(cur, next);
      router.replace('/berber');
    } catch (e: unknown) {
      const msg =
        typeof e === 'object' &&
        e !== null &&
        'message' in e &&
        typeof (e as { message: unknown }).message === 'string'
          ? (e as { message: string }).message
          : 'Sifre guncellenemedi. Bilgilerinizi kontrol edin.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageFrame
      contentMaxWidth={480}
      footerNote="Guvenlik icin gecici sifrenizi degistirin; islem bitene kadar panele erisemezsiniz.">
      <View style={{ gap: 24 }}>
        <View>
          <Text
            className="font-display text-2xl font-bold"
            style={{ color: theme.onSurface }}>
            Sifrenizi yenileyin
          </Text>
          <Text
            className="mt-2 font-body text-sm"
            style={{ color: theme.onSurfaceVariant }}>
            Hesabiniz sistem tarafindan olusturuldu. Panele devam etmek icin yeni bir sifre
            belirleyin.
          </Text>
        </View>

        {errorMessage ? (
          <View
            style={{
              borderRadius: 8,
              padding: 12,
              backgroundColor: hexToRgba(theme.error, 0.12),
              borderWidth: 1,
              borderColor: hexToRgba(theme.error, 0.35),
            }}>
            <Text className="font-body text-sm" style={{ color: theme.error }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <AuthCredentialField
          label="Mevcut sifre"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="E-postadaki gecici sifre"
          icon="lock"
          secureTextEntry
          canToggleSecureEntry
          textContentType="password"
        />

        <AuthCredentialField
          label="Yeni sifre"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="En az 8 karakter"
          icon="lock-outline"
          secureTextEntry
          canToggleSecureEntry
          textContentType="newPassword"
        />

        <AuthCredentialField
          label="Yeni sifre (tekrar)"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Yeni sifreyi tekrarlayin"
          icon="verified-user"
          secureTextEntry
          canToggleSecureEntry
          textContentType="newPassword"
        />

        <Button
          title={isSubmitting ? 'Kaydediliyor...' : 'Sifreyi kaydet ve devam et'}
          onPress={() => {
            void handleSubmit();
          }}
          disabled={isSubmitting}
        />

        <Button
          title="Cikis yap"
          variant="outline"
          onPress={() => {
            void logout();
            router.replace('/personel/giris');
          }}
        />
      </View>
    </AuthPageFrame>
  );
}
