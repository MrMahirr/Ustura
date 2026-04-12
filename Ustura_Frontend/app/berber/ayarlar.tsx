import React from 'react';
import { Platform, View } from 'react-native';

import BarberTopBar from '@/components/panel/barber-admin/BarberTopBar';
import PanelPlaceholder from '@/components/panel/PanelPlaceholder';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';

export default function BarberAyarlarScreen() {
  const [query, setQuery] = React.useState('');
  const theme = useBarberAdminTheme();

  return (
    <View
      className="relative flex-1 overflow-hidden"
      style={{ backgroundColor: theme.pageBackground }}>
      <View
        className="absolute inset-0"
        pointerEvents="none"
        style={
          Platform.OS === 'web'
            ? ({
                opacity: 1,
                backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.dotOverlay} 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              } as any)
            : { opacity: 0 }
        }
      />
      <BarberTopBar query={query} onQueryChange={setQuery} />
      <PanelPlaceholder
        title="Ayarlar"
        description="Salon ayarlari yaklasimda. Bu alandan salon bilgilerinizi ve tercihlerinizi duzenleyebilirsiniz."
        icon="settings"
      />
    </View>
  );
}
