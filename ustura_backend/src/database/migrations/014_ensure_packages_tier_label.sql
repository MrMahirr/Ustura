-- ============================================================
-- USTURA — Eski/parcali kurulumlarda packages.tier_label yoksa ekle
-- Dosya  : 014_ensure_packages_tier_label.sql
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'packages'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'packages' AND column_name = 'tier_label'
  ) THEN
    ALTER TABLE packages ADD COLUMN tier_label VARCHAR(100);
    UPDATE packages SET tier_label = COALESCE(NULLIF(TRIM(name), ''), tier, 'Paket') WHERE tier_label IS NULL;
    ALTER TABLE packages ALTER COLUMN tier_label SET NOT NULL;
  END IF;
END $$;
