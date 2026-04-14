-- ============================================================
-- USTURA — personnel: ilk giris zorunlu sifre degisimi
-- Dosya  : 017_personnel_must_change_password.sql
-- Notlar : Sistem tarafindan olusturulan personel sifresi sonrasi
--          JWT + API ile panel erisimi kisitlanir.
-- ============================================================

ALTER TABLE personnel
    ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE;
