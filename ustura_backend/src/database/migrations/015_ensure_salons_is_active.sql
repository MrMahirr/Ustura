-- ============================================================
-- USTURA — Eski şemalarda salons.is_active / salons.city yoksa ekle
-- Dosya  : 015_ensure_salons_is_active.sql
-- ============================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'salons'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'salons' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE salons ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'salons'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'salons' AND column_name = 'city'
  ) THEN
    ALTER TABLE salons ADD COLUMN city VARCHAR(80) NOT NULL DEFAULT 'Bilinmiyor';
  END IF;
END $$;
