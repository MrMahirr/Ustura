import '../global.css';

import { Stack } from 'expo-router';
import { View } from 'react-native';
import { vars } from 'nativewind';

import { getNativeWindThemeVariables } from '@/constants/nativewind-theme';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';

function RootNavigator() {
  const { theme } = useAppTheme();

  return (
    <View style={vars(getNativeWindThemeVariables(theme))} className="flex-1 bg-[--color-surface]">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  // TODO: Font yukleme (Noto Serif, Manrope)
  // TODO: QueryClientProvider sarmalayici
  // TODO: Zustand persist hydration
  // TODO: SplashScreen gizleme
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
