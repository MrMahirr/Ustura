import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { useAuthContext } from '@/contexts/AuthContext';
import { hexToRgba } from '@/utils/color';

import { useBarberAdminTheme } from '../../theme';
import SettingsSection from '../SettingsSection';
import { getBarberInputStyle, getBarberInputWebStyle } from '../presentation';

export default function AccountTab() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const isMobile = width < 640;
  const { user, submitPasswordChange, logout } = useAuthContext();

  const [currentPw, setCurrentPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');
  const [confirmPw, setConfirmPw] = React.useState('');
  const [pwSaving, setPwSaving] = React.useState(false);
  const [pwError, setPwError] = React.useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = React.useState(false);

  const inputStyle = getBarberInputStyle(theme);
  const webStyle = getBarberInputWebStyle();

  const roleLabelMap: Record<string, string> = {
    owner: 'Salon Sahibi',
    barber: 'Berber',
    receptionist: 'Resepsiyonist',
    super_admin: 'Platform Yöneticisi',
    customer: 'Müşteri',
  };

  const handlePasswordChange = async () => {
    if (newPw !== confirmPw) {
      setPwError('Yeni şifreler eşleşmiyor.');
      return;
    }
    if (newPw.length < 6) {
      setPwError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    try {
      setPwSaving(true);
      setPwError(null);
      setPwSuccess(false);
      await submitPasswordChange(currentPw, newPw);
      setPwSuccess(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err?.message ?? 'Şifre değiştirme başarısız oldu.');
    } finally {
      setPwSaving(false);
    }
  };

  const canSubmitPw = currentPw.length > 0 && newPw.length >= 6 && confirmPw.length >= 6;

  return (
    <View className="gap-5">
      <SettingsSection
        title="Profil Bilgileri"
        icon="badge"
        description="Hesap bilgileriniz oturum verilerinizden alınmaktadır.">
        <InfoRow label="Ad Soyad" value={user?.fullName ?? '—'} theme={theme} isMobile={isMobile} />
        <InfoRow label="E-posta" value={user?.email ?? '—'} theme={theme} isMobile={isMobile} />
        <InfoRow label="Telefon" value={user?.phone ?? '—'} theme={theme} isMobile={isMobile} />
        <InfoRow
          label="Rol"
          value={roleLabelMap[user?.role ?? ''] ?? user?.role ?? '—'}
          theme={theme}
          isMobile={isMobile}
        />
      </SettingsSection>

      <SettingsSection title="Şifre Değiştir" icon="lock-outline">
        <View className="gap-3">
          <PasswordField
            label="Mevcut Şifre"
            value={currentPw}
            onChange={setCurrentPw}
            inputStyle={inputStyle}
            webStyle={webStyle}
            theme={theme}
          />
          <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <PasswordField
                label="Yeni Şifre"
                value={newPw}
                onChange={setNewPw}
                inputStyle={inputStyle}
                webStyle={webStyle}
                theme={theme}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PasswordField
                label="Yeni Şifre (Tekrar)"
                value={confirmPw}
                onChange={setConfirmPw}
                inputStyle={inputStyle}
                webStyle={webStyle}
                theme={theme}
              />
            </View>
          </View>
        </View>

        {pwError && (
          <Text style={{ color: theme.error, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
            {pwError}
          </Text>
        )}
        {pwSuccess && (
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="check-circle" size={16} color={theme.success} />
            <Text style={{ color: theme.success, fontSize: 12, fontFamily: 'Manrope-Bold' }}>
              Şifre başarıyla değiştirildi.
            </Text>
          </View>
        )}

        <Pressable
          onPress={handlePasswordChange}
          disabled={!canSubmitPw || pwSaving}
          className="flex-row items-center gap-2 self-start rounded-lg px-6 py-3"
          style={{
            backgroundColor: canSubmitPw ? theme.primary : hexToRgba(theme.onSurfaceVariant, 0.12),
            opacity: pwSaving ? 0.6 : 1,
          }}>
          {pwSaving ? (
            <ActivityIndicator size="small" color={theme.onPrimary} />
          ) : (
            <MaterialIcons
              name="vpn-key"
              size={16}
              color={canSubmitPw ? theme.onPrimary : hexToRgba(theme.onSurfaceVariant, 0.4)}
            />
          )}
          <Text
            style={{
              color: canSubmitPw ? theme.onPrimary : hexToRgba(theme.onSurfaceVariant, 0.4),
              fontFamily: 'Manrope-Bold',
              fontSize: 13,
            }}>
            Şifreyi Güncelle
          </Text>
        </Pressable>
      </SettingsSection>

      <SettingsSection title="Oturum" icon="exit-to-app">
        <Pressable
          onPress={logout}
          className="flex-row items-center gap-2 self-start rounded-lg border px-5 py-3"
          style={({ hovered }) => [
            { borderColor: hexToRgba(theme.error, 0.25) },
            Platform.OS === 'web' && hovered
              ? ({
                  backgroundColor: hexToRgba(theme.error, 0.06),
                  cursor: 'pointer',
                  transition: 'background-color 180ms ease',
                } as any)
              : Platform.OS === 'web'
                ? ({ cursor: 'pointer', transition: 'background-color 180ms ease' } as any)
                : null,
          ]}>
          <MaterialIcons name="logout" size={16} color={theme.error} />
          <Text style={{ color: theme.error, fontFamily: 'Manrope-Bold', fontSize: 13 }}>
            Oturumu Kapat
          </Text>
        </Pressable>
      </SettingsSection>
    </View>
  );
}

function InfoRow({
  label,
  value,
  theme,
  isMobile,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useBarberAdminTheme>;
  isMobile: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 2 : 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: hexToRgba(theme.onSurfaceVariant, 0.06),
      }}>
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.7),
          fontFamily: 'Manrope-Bold',
          fontSize: 13,
        }}>
        {label}
      </Text>
      <Text style={{ color: theme.onSurface, fontFamily: 'Manrope-Bold', fontSize: 14 }}>
        {value}
      </Text>
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  inputStyle,
  webStyle,
  theme,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputStyle: any;
  webStyle: any;
  theme: ReturnType<typeof useBarberAdminTheme>;
}) {
  return (
    <View className="gap-2">
      <Text
        style={{
          color: hexToRgba(theme.onSurfaceVariant, 0.8),
          fontFamily: 'Manrope-Bold',
          fontSize: 12,
          letterSpacing: 0.4,
          textTransform: 'uppercase' as const,
        }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry
        placeholder="••••••"
        placeholderTextColor={hexToRgba(theme.onSurfaceVariant, 0.3)}
        style={[inputStyle, webStyle]}
      />
    </View>
  );
}
