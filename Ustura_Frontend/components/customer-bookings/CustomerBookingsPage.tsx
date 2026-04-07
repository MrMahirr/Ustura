import React from 'react';
import { Alert, Platform, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import CustomerBookingsHero from '@/components/customer-bookings/CustomerBookingsHero';
import CustomerBookingsHighlightCard from '@/components/customer-bookings/CustomerBookingsHighlightCard';
import CustomerBookingsListItem from '@/components/customer-bookings/CustomerBookingsListItem';
import CustomerBookingsTabs from '@/components/customer-bookings/CustomerBookingsTabs';
import {
  CUSTOMER_BOOKINGS_COPY,
  formatCustomerBookingDateTime,
  type CustomerBookingRecord,
} from '@/components/customer-bookings/presentation';
import { useCustomerBookings } from '@/components/customer-bookings/use-customer-bookings';
import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

function buildBookingDetailsMessage(booking: CustomerBookingRecord) {
  return [
    `Salon: ${booking.salonName}`,
    `Adres: ${booking.address}`,
    `Berber: ${booking.barberName}`,
    `Hizmet: ${booking.serviceName}`,
    `Tarih: ${formatCustomerBookingDateTime(booking.startsAt)}`,
  ].join('\n');
}

export default function CustomerBookingsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);
  const surface = useThemeColor({}, 'surface');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const {
    tabs,
    activeTab,
    visibleBookings,
    highlightedBooking,
    tabCounts,
    setActiveTab,
    cancelBooking,
  } = useCustomerBookings();

  const handleCreateBooking = React.useCallback(() => {
    router.push('/(public)/kuaforler');
  }, [router]);

  const handleViewDetails = React.useCallback((booking: CustomerBookingRecord) => {
    const message = buildBookingDetailsMessage(booking);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.alert(`${CUSTOMER_BOOKINGS_COPY.detailsPreviewTitle}\n\n${message}`);
      return;
    }

    Alert.alert(CUSTOMER_BOOKINGS_COPY.detailsPreviewTitle, message);
  }, []);

  const handleCancel = React.useCallback(
    (booking: CustomerBookingRecord) => {
      cancelBooking(booking.id);

      const cancelMessage = `${booking.salonName} icin ${formatCustomerBookingDateTime(booking.startsAt)} tarihli randevu iptal edildi.`;

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(`${CUSTOMER_BOOKINGS_COPY.cancelPreviewTitle}\n\n${cancelMessage}`);
        return;
      }

      Alert.alert(CUSTOMER_BOOKINGS_COPY.cancelPreviewTitle, cancelMessage);
    },
    [cancelBooking]
  );

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: surface }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: layout.horizontalPadding,
            paddingTop: layout.sectionPaddingVertical + 24,
            paddingBottom: 80,
          }}>
          <View className="w-full self-center" style={{ maxWidth: layout.contentMaxWidth, gap: 44 }}>
            <CustomerBookingsHero onCreateBooking={handleCreateBooking} />

            <CustomerBookingsHighlightCard
              booking={highlightedBooking}
              onViewDetails={handleViewDetails}
              onCancel={handleCancel}
            />

            <View style={{ gap: 24 }}>
              <CustomerBookingsTabs
                tabs={tabs}
                activeTab={activeTab}
                counts={tabCounts}
                onChange={setActiveTab}
              />

              {visibleBookings.length > 0 ? (
                <View style={{ gap: 16 }}>
                  {visibleBookings.map((booking) => (
                    <CustomerBookingsListItem
                      key={booking.id}
                      booking={booking}
                      onViewDetails={handleViewDetails}
                      onCancel={handleCancel}
                      onRepeatBooking={handleCreateBooking}
                    />
                  ))}
                </View>
              ) : (
                <View style={{ gap: 8, paddingVertical: 24 }}>
                  <Text className="font-headline text-3xl font-bold" style={{ color: onSurface }}>
                    {CUSTOMER_BOOKINGS_COPY.emptyTitle}
                  </Text>
                  <Text className="font-body text-base" style={{ maxWidth: 540, color: onSurfaceVariant }}>
                    {CUSTOMER_BOOKINGS_COPY.emptyDescription}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Footer />
      </ScrollView>
    </>
  );
}
