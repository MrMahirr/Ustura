import { Stack } from 'expo-router';

export default function RootLayout() {
  // TODO: Font yükleme (Noto Serif, Manrope)
  // TODO: QueryClientProvider sarmalayıcı
  // TODO: Zustand persist hydration
  // TODO: SplashScreen gizleme
  return <Stack screenOptions={{ headerShown: false }} />;
}
