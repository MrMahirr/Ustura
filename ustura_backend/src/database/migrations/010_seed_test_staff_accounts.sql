-- ============================================================
-- USTURA — Veritabanı Migration
-- Dosya  : 010_seed_test_staff_accounts.sql
-- Tarih  : 2026-04-12
-- Notlar : Test amaçlı owner, barber ve receptionist hesapları
--          oluşturur. Ayrıca bir test salonu ve staff atamaları
--          ekler. Tüm şifreler bcrypt ile hashlenir.
--
--   ┌──────────────┬─────────────────────────┬──────────────┐
--   │ Rol          │ E-posta                 │ Şifre        │
--   ├──────────────┼─────────────────────────┼──────────────┤
--   │ owner        │ owner@ustura.com        │ Owner123!    │
--   │ barber       │ berber@ustura.com       │ Berber123!   │
--   │ barber       │ berber2@ustura.com      │ Berber123!   │
--   │ receptionist │ resepsiyon@ustura.com   │ Resepsiyon1! │
--   └──────────────┴─────────────────────────┴──────────────┘
-- ============================================================

-- 1. TEST OWNER HESABI
INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Ahmet Yilmaz',
    'owner@ustura.com',
    '+905001112233',
    crypt('Owner123!', gen_salt('bf', 12)),
    'owner'
)
ON CONFLICT (email) DO NOTHING;

-- 2. TEST BERBER HESABI 1
INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Mehmet Kaya',
    'berber@ustura.com',
    '+905002223344',
    crypt('Berber123!', gen_salt('bf', 12)),
    'barber'
)
ON CONFLICT (email) DO NOTHING;

-- 3. TEST BERBER HESABI 2
INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'Can Demir',
    'berber2@ustura.com',
    '+905003334455',
    crypt('Berber123!', gen_salt('bf', 12)),
    'barber'
)
ON CONFLICT (email) DO NOTHING;

-- 4. TEST RESEPSIYONIST HESABI
INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'Elif Ozturk',
    'resepsiyon@ustura.com',
    '+905004445566',
    crypt('Resepsiyon1!', gen_salt('bf', 12)),
    'receptionist'
)
ON CONFLICT (email) DO NOTHING;

-- 5. TEST SALONU
INSERT INTO salons (id, owner_id, name, address, city, district, working_hours)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
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
)
ON CONFLICT DO NOTHING;

-- 6. STAFF ATAMALARI
INSERT INTO staff (user_id, salon_id, role, bio)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'barber',
    'Erkek sac kesimi ve sakal bakimi konusunda 8 yillik deneyim.'
)
ON CONFLICT (user_id, salon_id) DO NOTHING;

INSERT INTO staff (user_id, salon_id, role, bio)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'barber',
    'Cilt bakimi ve modern sac modelleri uzmani.'
)
ON CONFLICT (user_id, salon_id) DO NOTHING;

INSERT INTO staff (user_id, salon_id, role, bio)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'receptionist',
    'Randevu yonetimi ve musteri iliskileri.'
)
ON CONFLICT (user_id, salon_id) DO NOTHING;
