-- ============================================================
-- USTURA — Fix seed UUID format for validator.js v13+ compat
-- Dosya  : 018_fix_seed_uuid_format.sql
-- Notlar : Seed verilerinde kullanılan deterministik UUID'ler
--          RFC 4122 v4 formatına uymuyor (version=0, variant=0).
--          validator.js v13.15+ bunları reddeder.
--          Bu migration tüm seed UUID'leri v4 uyumlu hale getirir:
--          x0000000-0000-0000-0000-... → x0000000-0000-4000-a000-...
-- ============================================================

BEGIN;

-- 1) FK kısıtlamalarını geçici olarak kaldır
ALTER TABLE salons           DROP CONSTRAINT IF EXISTS salons_owner_id_fkey;
ALTER TABLE staff             DROP CONSTRAINT IF EXISTS staff_user_id_fkey;
ALTER TABLE staff             DROP CONSTRAINT IF EXISTS staff_salon_id_fkey;
ALTER TABLE reservations      DROP CONSTRAINT IF EXISTS reservations_salon_id_fkey;
ALTER TABLE reservations      DROP CONSTRAINT IF EXISTS reservations_customer_id_fkey;
ALTER TABLE subscriptions     DROP CONSTRAINT IF EXISTS subscriptions_salon_id_fkey;
ALTER TABLE owner_applications DROP CONSTRAINT IF EXISTS owner_applications_reviewed_by_fkey;
ALTER TABLE owner_applications DROP CONSTRAINT IF EXISTS owner_applications_approved_owner_fkey;

-- 2) platform_admins
UPDATE platform_admins
SET id = 'f0000000-0000-4000-a000-000000000001'
WHERE id = 'f0000000-0000-0000-0000-000000000001';

-- 3) personnel
UPDATE personnel SET id = 'a0000000-0000-4000-a000-000000000001' WHERE id = 'a0000000-0000-0000-0000-000000000001';
UPDATE personnel SET id = 'b0000000-0000-4000-a000-000000000001' WHERE id = 'b0000000-0000-0000-0000-000000000001';
UPDATE personnel SET id = 'b0000000-0000-4000-a000-000000000002' WHERE id = 'b0000000-0000-0000-0000-000000000002';
UPDATE personnel SET id = 'c0000000-0000-4000-a000-000000000001' WHERE id = 'c0000000-0000-0000-0000-000000000001';

-- 4) salons (önce owner_id, sonra id)
UPDATE salons SET owner_id = 'a0000000-0000-4000-a000-000000000001' WHERE owner_id = 'a0000000-0000-0000-0000-000000000001';
UPDATE salons SET id = 'd0000000-0000-4000-a000-000000000001' WHERE id = 'd0000000-0000-0000-0000-000000000001';

-- 5) staff
UPDATE staff SET user_id = 'a0000000-0000-4000-a000-000000000001' WHERE user_id = 'a0000000-0000-0000-0000-000000000001';
UPDATE staff SET user_id = 'b0000000-0000-4000-a000-000000000001' WHERE user_id = 'b0000000-0000-0000-0000-000000000001';
UPDATE staff SET user_id = 'b0000000-0000-4000-a000-000000000002' WHERE user_id = 'b0000000-0000-0000-0000-000000000002';
UPDATE staff SET user_id = 'c0000000-0000-4000-a000-000000000001' WHERE user_id = 'c0000000-0000-0000-0000-000000000001';
UPDATE staff SET salon_id = 'd0000000-0000-4000-a000-000000000001' WHERE salon_id = 'd0000000-0000-0000-0000-000000000001';

-- 6) reservations (mevcut randevularda eski salon/staff referansı varsa)
UPDATE reservations SET salon_id = 'd0000000-0000-4000-a000-000000000001' WHERE salon_id = 'd0000000-0000-0000-0000-000000000001';

-- 7) subscriptions
UPDATE subscriptions SET salon_id = 'd0000000-0000-4000-a000-000000000001' WHERE salon_id = 'd0000000-0000-0000-0000-000000000001';

-- 8) owner_applications
UPDATE owner_applications SET reviewed_by_user_id = 'f0000000-0000-4000-a000-000000000001' WHERE reviewed_by_user_id = 'f0000000-0000-0000-0000-000000000001';
UPDATE owner_applications SET approved_owner_user_id = 'a0000000-0000-4000-a000-000000000001' WHERE approved_owner_user_id = 'a0000000-0000-0000-0000-000000000001';

-- 9) notifications (FK yok, ama recipient_id eşleşmeli)
UPDATE notifications SET recipient_id = 'f0000000-0000-4000-a000-000000000001' WHERE recipient_id = 'f0000000-0000-0000-0000-000000000001';
UPDATE notifications SET recipient_id = 'a0000000-0000-4000-a000-000000000001' WHERE recipient_id = 'a0000000-0000-0000-0000-000000000001';
UPDATE notifications SET recipient_id = 'b0000000-0000-4000-a000-000000000001' WHERE recipient_id = 'b0000000-0000-0000-0000-000000000001';
UPDATE notifications SET recipient_id = 'b0000000-0000-4000-a000-000000000002' WHERE recipient_id = 'b0000000-0000-0000-0000-000000000002';
UPDATE notifications SET recipient_id = 'c0000000-0000-4000-a000-000000000001' WHERE recipient_id = 'c0000000-0000-0000-0000-000000000001';

-- 10) refresh_tokens (FK yok)
UPDATE refresh_tokens SET principal_id = 'f0000000-0000-4000-a000-000000000001' WHERE principal_id = 'f0000000-0000-0000-0000-000000000001';
UPDATE refresh_tokens SET principal_id = 'a0000000-0000-4000-a000-000000000001' WHERE principal_id = 'a0000000-0000-0000-0000-000000000001';
UPDATE refresh_tokens SET principal_id = 'b0000000-0000-4000-a000-000000000001' WHERE principal_id = 'b0000000-0000-0000-0000-000000000001';
UPDATE refresh_tokens SET principal_id = 'b0000000-0000-4000-a000-000000000002' WHERE principal_id = 'b0000000-0000-0000-0000-000000000002';
UPDATE refresh_tokens SET principal_id = 'c0000000-0000-4000-a000-000000000001' WHERE principal_id = 'c0000000-0000-0000-0000-000000000001';

-- 11) audit_logs (actor_user_id, FK yok — 012'de users silindikten sonra orphan)
UPDATE audit_logs SET actor_user_id = 'f0000000-0000-4000-a000-000000000001' WHERE actor_user_id = 'f0000000-0000-0000-0000-000000000001';
UPDATE audit_logs SET actor_user_id = 'a0000000-0000-4000-a000-000000000001' WHERE actor_user_id = 'a0000000-0000-0000-0000-000000000001';
UPDATE audit_logs SET actor_user_id = 'b0000000-0000-4000-a000-000000000001' WHERE actor_user_id = 'b0000000-0000-0000-0000-000000000001';
UPDATE audit_logs SET actor_user_id = 'b0000000-0000-4000-a000-000000000002' WHERE actor_user_id = 'b0000000-0000-0000-0000-000000000002';
UPDATE audit_logs SET actor_user_id = 'c0000000-0000-4000-a000-000000000001' WHERE actor_user_id = 'c0000000-0000-0000-0000-000000000001';

-- 12) FK kısıtlamalarını yeniden oluştur
ALTER TABLE salons
    ADD CONSTRAINT salons_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES personnel (id) ON DELETE CASCADE;

ALTER TABLE staff
    ADD CONSTRAINT staff_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES personnel (id) ON DELETE CASCADE;

ALTER TABLE staff
    ADD CONSTRAINT staff_salon_id_fkey
    FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE;

ALTER TABLE reservations
    ADD CONSTRAINT reservations_salon_id_fkey
    FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE;

ALTER TABLE reservations
    ADD CONSTRAINT reservations_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE;

ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_salon_id_fkey
    FOREIGN KEY (salon_id) REFERENCES salons (id) ON DELETE CASCADE;

ALTER TABLE owner_applications
    ADD CONSTRAINT owner_applications_reviewed_by_fkey
    FOREIGN KEY (reviewed_by_user_id) REFERENCES platform_admins (id) ON DELETE SET NULL;

ALTER TABLE owner_applications
    ADD CONSTRAINT owner_applications_approved_owner_fkey
    FOREIGN KEY (approved_owner_user_id) REFERENCES personnel (id) ON DELETE SET NULL;

COMMIT;
