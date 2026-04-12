export interface SlotScope {
  salonId: string;
  date: string;
  staffId?: string | null;
}

export interface SlotSelection {
  holderId: string;
  slotStart: string;
  expiresAt: string;
}

export interface AvailableSlot {
  start: string;
  end: string;
  available: boolean;
  status: 'available' | 'reserved' | 'held';
  heldUntil: string | null;
  availableStaffIds?: string[];
}
