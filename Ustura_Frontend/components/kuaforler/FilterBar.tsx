import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { MaterialIcons } from '@expo/vector-icons';

export default function FilterBar() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const primary = useThemeColor({}, 'primary');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCity, setActiveCity] = useState('Tümü');

  const cities = ['Tümü', 'İstanbul', 'Ankara', 'İzmir'];

  return (
    <View style={styles.container}>
      {/* Title & Search row */}
      <View style={[styles.topRow, { flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'flex-end' : 'flex-start' }]}>
        <View style={styles.titleSection}>
          <Text style={[styles.label, { color: primary }]}>KEŞFET</Text>
          <Text style={[styles.headline, { color: useThemeColor({}, 'onSurface') }]}>Kuaförler</Text>
        </View>

        <View style={[styles.searchSection, { width: isDesktop ? 384 : '100%' }]}>
          <Input 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Salon veya hizmet ara..."
            iconLeft="search"
            containerStyle={{ marginTop: 0, borderBottomWidth: 2 }}
          />
        </View>
      </View>

      {/* Filters row */}
      <View style={[styles.bottomRow, { flexDirection: isDesktop ? 'row' : 'column', alignItems: isDesktop ? 'center' : 'flex-start' }]}>
        <View style={styles.badgesWrapper}>
          {cities.map((city) => (
            <Badge 
              key={city} 
              label={city} 
              isActive={activeCity === city}
              onPress={() => setActiveCity(city)} 
            />
          ))}
        </View>

        {/* Mock Dropdown */}
        <View style={[styles.sortWrapper, { marginTop: isDesktop ? 0 : 24 }]}>
          <Text style={[styles.sortLabel, { color: onSurfaceVariant }]}>SIRALAMA:</Text>
          <Pressable style={styles.mockSelect}>
            <Text style={[styles.selectText, { color: primary }]}>Puana Göre</Text>
            <MaterialIcons name="expand-more" size={20} color={primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 48,
    gap: 24,
  },
  topRow: {
    justifyContent: 'space-between',
    gap: 24,
  },
  titleSection: {
    gap: 8,
  },
  label: {
    ...Typography.labelLg,
    letterSpacing: 2,
  },
  headline: {
    ...Typography.displayLg,
  },
  searchSection: {
    alignSelf: 'stretch',
  },
  bottomRow: {
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
  },
  badgesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sortWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sortLabel: {
    ...Typography.labelLg,
  },
  mockSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectText: {
    ...Typography.bodyMd,
    fontFamily: 'Manrope-Bold',
  },
});
