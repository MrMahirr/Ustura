-- ============================================================
-- USTURA — Idempotent demo seed (post–identity split)
-- Dosya  : 013_seed_demo_identity.sql
-- Notlar : 012 sonrası platform_admins / personnel / salons / staff
--          üzerinde aynı demo hesapları garanti eder. 008+010+012
--          tam zincirde çalıştıysa çoğu INSERT atlanır (NOT EXISTS).
--          E-postalar: admin@ustura.com, owner@ustura.com, ...
-- ============================================================

-- 1) Platform super admin
INSERT INTO platform_admins (id, name, email, phone, password_hash, is_active)
SELECT
    'f0000000-0000-4000-a000-000000000001'::uuid,
    'Super Admin',
    'admin@ustura.com',
    '+900000000000',
    crypt('Admin123!', gen_salt('bf', 10)),
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM platform_admins WHERE LOWER(email) = LOWER('admin@ustura.com')
);

-- 2) Personnel — owner
INSERT INTO personnel (id, name, email, phone, password_hash, role, is_active)
SELECT
    'a0000000-0000-4000-a000-000000000001'::uuid,
    'Ahmet Yilmaz',
    'owner@ustura.com',
    '+905001112233',
    crypt('Owner123!', gen_salt('bf', 12)),
    'owner',
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM personnel WHERE LOWER(email) = LOWER('owner@ustura.com')
);

-- 3) Personnel — barbers
INSERT INTO personnel (id, name, email, phone, password_hash, role, is_active)
SELECT
    'b0000000-0000-4000-a000-000000000001'::uuid,
    'Mehmet Kaya',
    'berber@ustura.com',
    '+905002223344',
    crypt('Berber123!', gen_salt('bf', 12)),
    'barber',
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM personnel WHERE LOWER(email) = LOWER('berber@ustura.com')
);

INSERT INTO personnel (id, name, email, phone, password_hash, role, is_active)
SELECT
    'b0000000-0000-4000-a000-000000000002'::uuid,
    'Can Demir',
    'berber2@ustura.com',
    '+905003334455',
    crypt('Berber123!', gen_salt('bf', 12)),
    'barber',
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM personnel WHERE LOWER(email) = LOWER('berber2@ustura.com')
);

-- 4) Personnel — receptionist
INSERT INTO personnel (id, name, email, phone, password_hash, role, is_active)
SELECT
    'c0000000-0000-4000-a000-000000000001'::uuid,
    'Elif Ozturk',
    'resepsiyon@ustura.com',
    '+905004445566',
    crypt('Resepsiyon1!', gen_salt('bf', 12)),
    'receptionist',
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM personnel WHERE LOWER(email) = LOWER('resepsiyon@ustura.com')
);

-- 5) Test salonu (sahip satırı bu id ile mevcut olmalı)
INSERT INTO salons (id, owner_id, name, address, city, district, working_hours)
SELECT
    'd0000000-0000-4000-a000-000000000001'::uuid,
    'a0000000-0000-4000-a000-000000000001'::uuid,
    'Ustura Test Salonu',
    'Abdi Ipekci Caddesi No:42',
    'Istanbul',
    'Nisantasi',
    '{
      "monday":    {"open": "09:00", "close": "20:00"},
      "tuesday":   {"open": "09:00", "close": "20:00"},
      "wednesday": {"open": "09:00", "close": "20:00"},
      "thursday":  {"open": "09:00", "close": "20:00"},
      "friday":    {"open": "09:00", "close": "21:00"},
      "saturday":  {"open": "10:00", "close": "18:00"},
      "sunday":    null
    }'::jsonb
WHERE NOT EXISTS (
    SELECT 1 FROM salons WHERE id = 'd0000000-0000-4000-a000-000000000001'::uuid
)
AND EXISTS (
    SELECT 1 FROM personnel WHERE id = 'a0000000-0000-4000-a000-000000000001'::uuid
);

-- 6) Staff atamalari
INSERT INTO staff (user_id, salon_id, role, bio)
SELECT
    'b0000000-0000-4000-a000-000000000001'::uuid,
    'd0000000-0000-4000-a000-000000000001'::uuid,
    'barber',
    'Erkek sac kesimi ve sakal bakimi konusunda 8 yillik deneyim.'
WHERE NOT EXISTS (
    SELECT 1 FROM staff
    WHERE user_id = 'b0000000-0000-4000-a000-000000000001'::uuid
      AND salon_id = 'd0000000-0000-4000-a000-000000000001'::uuid
);

INSERT INTO staff (user_id, salon_id, role, bio)
SELECT
    'b0000000-0000-4000-a000-000000000002'::uuid,
    'd0000000-0000-4000-a000-000000000001'::uuid,
    'barber',
    'Cilt bakimi ve modern sac modelleri uzmani.'
WHERE NOT EXISTS (
    SELECT 1 FROM staff
    WHERE user_id = 'b0000000-0000-4000-a000-000000000002'::uuid
      AND salon_id = 'd0000000-0000-4000-a000-000000000001'::uuid
);

INSERT INTO staff (user_id, salon_id, role, bio)
SELECT
    'c0000000-0000-4000-a000-000000000001'::uuid,
    'd0000000-0000-4000-a000-000000000001'::uuid,
    'receptionist',
    'Randevu yonetimi ve musteri iliskileri.'
WHERE NOT EXISTS (
    SELECT 1 FROM staff
    WHERE user_id = 'c0000000-0000-4000-a000-000000000001'::uuid
      AND salon_id = 'd0000000-0000-4000-a000-000000000001'::uuid
);
