import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  // TODO: Font yükleme (Noto Serif, Manrope)
  // TODO: QueryClientProvider sarmalayıcı
  // TODO: Zustand persist hydration
  // TODO: SplashScreen gizleme
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
