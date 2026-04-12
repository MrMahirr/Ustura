-- ============================================================
-- USTURA — Veritabanı Migration
-- Dosya  : 009_create_packages_schema.sql
-- Tarih  : 2026-04-11
-- Notlar : Paket ve Abonelik tablolarının oluşturulması.
-- ============================================================

-- 1. PACKAGES
CREATE TABLE IF NOT EXISTS packages (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(100)  NOT NULL,
    tier             VARCHAR(50)   NOT NULL, -- 'baslangic', 'profesyonel', 'kurumsal'
    tier_label       VARCHAR(100)  NOT NULL, -- 'Standard Access' vb.
    price_per_month  DECIMAL(12,2) NOT NULL DEFAULT 0,
    features         JSONB         NOT NULL DEFAULT '[]',
    is_featured      BOOLEAN       NOT NULL DEFAULT FALSE,
    is_active        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_tier ON packages (tier);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages (is_active);

-- 2. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id         UUID          NOT NULL REFERENCES salons (id) ON DELETE CASCADE,
    package_id       UUID          NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
    start_date       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    end_date         TIMESTAMPTZ,
    status           VARCHAR(20)   NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'expired', 'pending', 'cancelled')),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_salon_id ON subscriptions (salon_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_package_id ON subscriptions (package_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);

-- 3. UPDATED_AT TRIGGERS
CREATE TRIGGER trg_packages_updated_at
    BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. SEED DEFAULT PACKAGES
INSERT INTO packages (name, tier, tier_label, price_per_month, features, is_featured)
VALUES 
('Baslangic', 'baslangic', 'Standard Access', 299.00, '[{"label": "Maks. 3 Berber Hesabi", "included": true}, {"label": "Online Randevu Takvimi", "included": true}, {"label": "Musteri Veritabani", "included": true}, {"label": "SMS Hatirlaticilar", "included": false}, {"label": "Finansal Raporlama", "included": false}]'::jsonb, false),
('Profesyonel', 'profesyonel', 'Expert Tier', 599.00, '[{"label": "Maks. 10 Berber Hesabi", "included": true}, {"label": "Online Randevu Takvimi", "included": true}, {"label": "Gelismis SMS Paketi", "included": true}, {"label": "Temel Gelir Analizi", "included": true}, {"label": "Envanter Takibi", "included": false}]'::jsonb, true),
('Kurumsal', 'kurumsal', 'Unlimited Growth', 1299.00, '[{"label": "Sinirsiz Berber Hesabi", "included": true}, {"label": "Oncelikli Teknik Destek", "included": true}, {"label": "Tum Entegrasyonlar", "included": true}, {"label": "Gelismis Raporlama", "included": true}, {"label": "API Erisimi", "included": true}]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;
