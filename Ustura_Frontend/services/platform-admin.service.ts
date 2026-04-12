import { apiRequest } from '@/services/api';

export interface OwnerApplicationWorkingHoursEntry {
  open: string;
  close: string;
}

export interface OwnerApplicationRecord {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonDistrict: string | null;
  salonPhotoUrl: string | null;
  salonWorkingHours: Record<string, OwnerApplicationWorkingHoursEntry | null>;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  rejectionReason: string | null;
  approvedOwnerUserId: string | null;
  approvedSalonId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitOwnerApplicationInput {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  password: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonDistrict?: string;
  notes?: string;
}

const DEFAULT_WORKING_HOURS: Record<string, OwnerApplicationWorkingHoursEntry> = {
  monday: { open: '09:00', close: '19:00' },
  tuesday: { open: '09:00', close: '19:00' },
  wednesday: { open: '09:00', close: '19:00' },
  thursday: { open: '09:00', close: '19:00' },
  friday: { open: '09:00', close: '19:00' },
  saturday: { open: '09:00', close: '19:00' },
  sunday: { open: '10:00', close: '18:00' },
};

interface SubmitOwnerApplicationPayload {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  password: string;
  salonName: string;
  salonAddress: string;
  salonCity: string;
  salonDistrict?: string;
  salonWorkingHours: Record<string, OwnerApplicationWorkingHoursEntry>;
  notes?: string;
}

function normalizeOptionalString(value?: string) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

export async function submitOwnerApplication(input: SubmitOwnerApplicationInput) {
  const payload: SubmitOwnerApplicationPayload = {
    applicantName: input.applicantName.trim(),
    applicantEmail: input.applicantEmail.trim().toLowerCase(),
    applicantPhone: input.applicantPhone.trim(),
    password: input.password,
    salonName: input.salonName.trim(),
    salonAddress: input.salonAddress.trim(),
    salonCity: input.salonCity.trim(),
    salonWorkingHours: DEFAULT_WORKING_HOURS,
    salonDistrict: normalizeOptionalString(input.salonDistrict),
    notes: normalizeOptionalString(input.notes),
  };

  return apiRequest<OwnerApplicationRecord, SubmitOwnerApplicationPayload>({
    path: '/owner-applications',
    method: 'POST',
    body: payload,
  });
}
