import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import WhyUs from '@/components/landing/WhyUs';
import RegistrationForm from '@/components/landing/RegistrationForm';
import Footer from '@/components/landing/Footer';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LandingPage() {
  const surface = useThemeColor({}, 'surface');

  return (
    <>
      <Navbar />
      <ScrollView 
        style={[styles.container, { backgroundColor: surface }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <HowItWorks />
        <WhyUs />
        <RegistrationForm />
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

