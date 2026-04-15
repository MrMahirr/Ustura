import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import BarberTopBar from '@/components/panel/barber-admin/BarberTopBar';
import { useBarberAdminTheme } from '@/components/panel/barber-admin/theme';
import { hexToRgba } from '@/utils/color';

import { staffClassNames } from './presentation';
import StaffDeleteDialog from './StaffDeleteDialog';
import StaffEditorModal from './StaffEditorModal';
import StaffFilterBar from './StaffFilterBar';
import StaffOverviewCards from './StaffOverviewCards';
import StaffPageHeader from './StaffPageHeader';
import StaffPermissionPanel from './StaffPermissionPanel';
import StaffRosterSection from './StaffRosterSection';
import { useBarberStaff } from './use-barber-staff';
import type { StaffDirectoryItem, StaffEditorMode, StaffEditorValues } from './types';

interface FeedbackState {
  tone: 'success' | 'error';
  message: string;
}

export default function BarberAdminStaffPage() {
  const { width } = useWindowDimensions();
  const theme = useBarberAdminTheme();
  const staffState = useBarberStaff();
  const [editorState, setEditorState] = React.useState<{
    mode: StaffEditorMode;
    staff: StaffDirectoryItem | null;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<StaffDirectoryItem | null>(null);
  const [feedback, setFeedback] = React.useState<FeedbackState | null>(null);
  const [dismissedError, setDismissedError] = React.useState<string | null>(null);

  const paddingHorizontal = width < 768 ? 16 : width < 1280 ? 24 : 32;
  const showSplitSummary = width >= 1180;

  React.useEffect(() => {
    if (!staffState.error) {
      setDismissedError(null);
    }
  }, [staffState.error]);

  const handleEditorSubmit = async (values: StaffEditorValues) => {
    if (!editorState) {
      return;
    }

    if (editorState.mode === 'create') {
      await staffState.createStaffAccess(values);
      setFeedback({
        tone: 'success',
        message: 'Yeni personel erisimi olusturuldu. Gecici parola akisi sunucu tarafinda yonetilir.',
      });
      return;
    }

    if (!editorState.staff) {
      return;
    }

    await staffState.updateStaffAccess(editorState.staff.id, values);
    setFeedback({
      tone: 'success',
      message: `${editorState.staff.displayName} icin rol ve panel notlari guncellendi.`,
    });
  };

  const handleDeleteConfirm = async (item: StaffDirectoryItem) => {
    await staffState.removeStaffAccess(item.id);
    setFeedback({
      tone: 'success',
      message: `${item.displayName} icin salon personel erisimi kaldirildi.`,
    });
  };

  if (staffState.loading && staffState.items.length === 0) {
    return (
      <View className={staffClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
        <BarberTopBar
          query={staffState.query}
          onQueryChange={staffState.setQuery}
          placeholder="Personel, rol veya gorev notu ara..."
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    );
  }

  return (
    <View className={staffClassNames.page} style={{ backgroundColor: theme.pageBackground }}>
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

      <BarberTopBar
        query={staffState.query}
        onQueryChange={staffState.setQuery}
        placeholder="Personel, rol veya gorev notu ara..."
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}>
        <View className={staffClassNames.content}>
          <StaffPageHeader
            salonName={staffState.salon?.name}
            totalCount={staffState.overview.total}
            onRefresh={() => {
              setDismissedError(null);
              void staffState.refresh();
            }}
            onCreate={() => setEditorState({ mode: 'create', staff: null })}
          />

          {feedback ? (
            <FeedbackBanner
              tone={feedback.tone}
              message={feedback.message}
              onDismiss={() => setFeedback(null)}
            />
          ) : null}

          {staffState.error &&
          staffState.items.length > 0 &&
          staffState.error !== dismissedError ? (
            <FeedbackBanner
              tone="error"
              message={staffState.error}
              onDismiss={() => setDismissedError(staffState.error)}
            />
          ) : null}

          <View style={{ gap: 16, flexDirection: showSplitSummary ? 'row' : 'column' }}>
            <View style={{ flex: showSplitSummary ? 1.3 : undefined }}>
              <StaffOverviewCards overview={staffState.overview} />
            </View>
            <View style={{ flex: showSplitSummary ? 1 : undefined }}>
              <StaffPermissionPanel insights={staffState.roleInsights} />
            </View>
          </View>

          <StaffFilterBar
            roleFilter={staffState.roleFilter}
            onRoleFilterChange={staffState.setRoleFilter}
            filteredCount={staffState.filteredItems.length}
            totalCount={staffState.items.length}
          />

          <StaffRosterSection
            items={staffState.filteredItems}
            loading={staffState.loading}
            error={staffState.error}
            onRetry={() => {
              setDismissedError(null);
              void staffState.refresh();
            }}
            onEdit={(item) => setEditorState({ mode: 'edit', staff: item })}
            onDelete={setDeleteTarget}
          />
        </View>
      </ScrollView>

      <StaffEditorModal
        visible={!!editorState}
        mode={editorState?.mode ?? 'create'}
        staff={editorState?.staff ?? null}
        mutating={staffState.mutating}
        onClose={() => setEditorState(null)}
        onSubmit={handleEditorSubmit}
      />

      <StaffDeleteDialog
        visible={!!deleteTarget}
        staff={deleteTarget}
        mutating={staffState.mutating}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
}

function FeedbackBanner({
  tone,
  message,
  onDismiss,
}: FeedbackState & { onDismiss: () => void }) {
  const theme = useBarberAdminTheme();
  const isSuccess = tone === 'success';
  const accentColor = isSuccess ? theme.success : theme.error;

  return (
    <View
      className="flex-row items-start justify-between gap-3 rounded-2xl border px-4 py-3"
      style={{
        borderColor: hexToRgba(accentColor, 0.22),
        backgroundColor: hexToRgba(accentColor, 0.08),
      }}>
      <View className="min-w-0 flex-1 flex-row items-start gap-3">
        <View
          className="mt-0.5 h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: hexToRgba(accentColor, 0.14) }}>
          <Text
            style={{
              color: accentColor,
              fontFamily: 'Manrope-Bold',
              fontSize: 16,
            }}>
            {isSuccess ? 'OK' : '!'}
          </Text>
        </View>
        <Text
          style={{
            color: accentColor,
            fontFamily: 'Manrope-SemiBold',
            fontSize: 13,
            lineHeight: 21,
            flex: 1,
          }}>
          {message}
        </Text>
      </View>

      <Pressable onPress={onDismiss}>
        <Text
          style={{
            color: accentColor,
            fontFamily: 'Manrope-Bold',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1.3,
          }}>
          Kapat
        </Text>
      </Pressable>
    </View>
  );
}
