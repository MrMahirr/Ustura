BEGIN;

CREATE TABLE IF NOT EXISTS salon_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salon_id UUID NOT NULL REFERENCES salons (id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 5 AND duration_minutes <= 480),
    price_amount INTEGER NOT NULL CHECK (price_amount >= 0 AND price_amount <= 100000),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salon_services_salon_id
    ON salon_services (salon_id);

CREATE INDEX IF NOT EXISTS idx_salon_services_is_active
    ON salon_services (is_active);

CREATE TRIGGER trg_salon_services_updated_at
    BEFORE UPDATE ON salon_services
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
