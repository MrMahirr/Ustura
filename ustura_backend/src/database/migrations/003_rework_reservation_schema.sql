-- ============================================================
-- USTURA - Reservation schema hardening
-- Dosya  : 003_rework_reservation_schema.sql
-- Notlar : Active reservation uniqueness, richer lifecycle
--          metadata and strict slot duration consistency.
-- ============================================================

ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS uq_reservation_staff_slot;

ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS reservations_status_check;

ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS chk_slot_order;

ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS chk_reservations_status_lifecycle;

ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS chk_reservations_slot_duration;

ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancelled_by_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS status_changed_by_user_id UUID REFERENCES users (id) ON DELETE SET NULL;

UPDATE reservations
SET
    cancelled_at = COALESCE(cancelled_at, updated_at),
    status_changed_at = COALESCE(status_changed_at, updated_at)
WHERE status = 'cancelled';

DROP INDEX IF EXISTS uq_reservations_active_staff_slot;

CREATE UNIQUE INDEX uq_reservations_active_staff_slot
    ON reservations (staff_id, slot_start)
    WHERE status IN ('pending', 'confirmed');

ALTER TABLE reservations
    ADD CONSTRAINT chk_reservations_status_lifecycle
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show'));

ALTER TABLE reservations
    ADD CONSTRAINT chk_reservations_slot_duration
    CHECK (slot_end = slot_start + INTERVAL '30 minutes');
