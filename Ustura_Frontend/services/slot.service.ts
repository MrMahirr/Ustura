import { apiRequest } from '@/services/api';

export type SlotStatus = 'available' | 'reserved' | 'held';

export interface SlotRecord {
  id: string;
  label: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
  status: SlotStatus;
  heldUntil: string | null;
  availableStaffIds: string[];
}

interface SlotResponse {
  start: string;
  end: string;
  available: boolean;
  status: SlotStatus;
  heldUntil: string | null;
  availableStaffIds?: string[];
}

interface SlotQuery {
  date: string;
  staffId?: string | null;
}

function formatSlotLabel(value: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function mapSlotResponse(slot: SlotResponse): SlotRecord {
  return {
    id: slot.start,
    label: formatSlotLabel(slot.start),
    startsAt: slot.start,
    endsAt: slot.end,
    available: slot.available,
    status: slot.status,
    heldUntil: slot.heldUntil,
    availableStaffIds: slot.availableStaffIds ?? [],
  };
}

export async function getAvailableSlots(salonId: string, query: SlotQuery) {
  const slots = await apiRequest<SlotResponse[]>({
    path: `/salons/${salonId}/slots`,
    query: {
      date: query.date,
      staff_id: query.staffId ?? undefined,
    },
  });

  return slots.map(mapSlotResponse);
}
