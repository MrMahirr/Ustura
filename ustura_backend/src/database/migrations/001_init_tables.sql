-- ============================================================
-- USTURA — Veritabanı Migration
-- Dosya  : 001_init_tables.sql
-- Tarih  : 2025-04-01
-- Notlar : ORM yok. pg / pg-pool ile raw SQL kullanılacak.
--          Tüm ID'ler UUID, zaman damgaları TIMESTAMPTZ (UTC).
-- ============================================================

-- UUID üretimi için extension (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    phone         VARCHAR(20)   NOT NULL,
    password_hash TEXT          NOT NULL,
    role          VARCHAR(20)   NOT NULL
                    CHECK (role IN ('super_admin','owner', 'barber', 'receptionist', 'customer')),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);


-- ============================================================
-- 2. SALONS
-- ============================================================
CREATE TABLE IF NOT EXISTS salons (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id      UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name          VARCHAR(150)  NOT NULL,
    address       TEXT          NOT NULL,
    city          VARCHAR(80)   NOT NULL,
    district      VARCHAR(80),
    photo_url     TEXT,
    working_hours JSONB         NOT NULL DEFAULT '{}',
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salons_owner_id  ON salons (owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_city      ON salons (city);
CREATE INDEX IF NOT EXISTS idx_salons_is_active ON salons (is_active);


-- ============================================================
-- 3. STAFF
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    salon_id    UUID         NOT NULL REFERENCES salons (id) ON DELETE CASCADE,
    role        VARCHAR(20)  NOT NULL
                    CHECK (role IN ('barber', 'receptionist')),
    bio         TEXT,
    photo_url   TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_staff_user_salon UNIQUE (user_id, salon_id)
);

CREATE INDEX IF NOT EXISTS idx_staff_salon_id  ON staff (salon_id);
CREATE INDEX IF NOT EXISTS idx_staff_user_id   ON staff (user_id);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON staff (is_active);


-- ============================================================
-- 4. RESERVATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id  UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    salon_id     UUID         NOT NULL REFERENCES salons (id) ON DELETE CASCADE,
    staff_id     UUID         NOT NULL REFERENCES staff (id) ON DELETE CASCADE,
    slot_start   TIMESTAMPTZ  NOT NULL,
    slot_end     TIMESTAMPTZ  NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes        TEXT,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_reservation_staff_slot UNIQUE (staff_id, slot_start),
    CONSTRAINT chk_slot_order CHECK (slot_end > slot_start)
);

CREATE INDEX IF NOT EXISTS idx_reservations_customer_id  ON reservations (customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_salon_id     ON reservations (salon_id);
CREATE INDEX IF NOT EXISTS idx_reservations_staff_id     ON reservations (staff_id);
CREATE INDEX IF NOT EXISTS idx_reservations_slot_start   ON reservations (slot_start);
CREATE INDEX IF NOT EXISTS idx_reservations_status       ON reservations (status);

CREATE INDEX IF NOT EXISTS idx_reservations_staff_date
    ON reservations (staff_id, slot_start);


-- ============================================================
-- 5. REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash  TEXT         NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ  NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id    ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);


-- ============================================================
-- 6. updated_at OTOMATİK GÜNCELLEME TRİGGER'I
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_salons_updated_at
    BEFORE UPDATE ON salons
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
