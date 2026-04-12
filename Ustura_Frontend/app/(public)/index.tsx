import React from 'react';
import { ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import SalonsSection from '@/components/landing/SalonsSection';
import WhyUs from '@/components/landing/WhyUs';
import RegistrationForm from '@/components/landing/RegistrationForm';
import Footer from '@/components/landing/Footer';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LandingPage() {
  const surface = useThemeColor({}, 'surface');
  const router = useRouter();
  const { scrollTo } = useLocalSearchParams<{ scrollTo?: string }>();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [registrationOffset, setRegistrationOffset] = React.useState<number | null>(null);

  const scrollToRegistration = React.useCallback(() => {
    if (registrationOffset === null) {
      return;
    }

    scrollViewRef.current?.scrollTo?.({
      y: Math.max(0, registrationOffset - 96),
      animated: true,
    });
  }, [registrationOffset]);

  React.useEffect(() => {
    if (scrollTo !== 'register') {
      return;
    }

    scrollToRegistration();

    if (registrationOffset !== null) {
      router.replace('/(public)');
    }
  }, [registrationOffset, router, scrollTo, scrollToRegistration]);

  return (
    <>
      <Navbar onRegisterPress={scrollToRegistration} />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        style={[
          { backgroundColor: surface },
          Platform.OS === 'web' ? ({ transition: 'background-color 360ms ease' } as any) : null,
        ]}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <HeroSection onRegisterPress={scrollToRegistration} />
        <HowItWorks />
        <SalonsSection />
        <WhyUs />
        <RegistrationForm onLayout={(event) => setRegistrationOffset(event.nativeEvent.layout.y)} />
        <Footer />
      </ScrollView>
    </>
  );
}
