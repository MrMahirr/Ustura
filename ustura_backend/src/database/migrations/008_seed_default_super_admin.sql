-- ============================================================
-- USTURA — Veritabanı Migration
-- Dosya  : 008_seed_default_super_admin.sql
-- Tarih  : 2026-04-10
-- Notlar : Legacy `users` tablosuna super_admin yazar; 012 bu satırı
--          platform_admins'a taşır ve users'ı kaldırır.
--          Sabit UUID, seed ve dokümantasyon için deterministik kalır.
--          E-posta: admin@ustura.com  Şifre: Admin123!
-- ============================================================

INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'f0000000-0000-4000-a000-000000000001',
    'Super Admin',
    'admin@ustura.com',
    '+900000000000',
    crypt('Admin123!', gen_salt('bf', 10)),
    'super_admin'
)
ON CONFLICT (email) DO NOTHING;
