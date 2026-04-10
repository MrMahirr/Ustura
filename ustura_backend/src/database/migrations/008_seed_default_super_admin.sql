-- ============================================================
-- USTURA — Veritabanı Migration
-- Dosya  : 008_seed_default_super_admin.sql
-- Tarih  : 2026-04-10
-- Notlar : Veritabanı oluşturulduğunda varsayılan bir super_admin
--          hesabının hazır bulunmasını sağlar.
-- ============================================================

INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
    'Super Admin',
    'admin@ustura.com',
    '+900000000000',
    crypt('Admin123!', gen_salt('bf', 10)),
    'super_admin'
)
ON CONFLICT (email) DO NOTHING;
