-- ============================================================
-- USTURA — Split monolithic users into customers / personnel / platform_admins
-- Same person may register as customer and later as salon owner (separate rows, same email allowed across tables).
-- Preserves UUIDs so existing FK targets remain valid after re-pointing.
-- ============================================================

-- 1) New identity tables
CREATE TABLE customers (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL,
    phone         VARCHAR(20)   NOT NULL,
    password_hash TEXT,
    firebase_uid  VARCHAR(128),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_customers_lower_email ON customers (LOWER(email));
CREATE UNIQUE INDEX idx_customers_firebase_uid_unique
    ON customers (firebase_uid)
    WHERE firebase_uid IS NOT NULL;

CREATE TABLE personnel (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL,
    phone         VARCHAR(20)   NOT NULL,
    password_hash TEXT,
    role          VARCHAR(20)   NOT NULL
                    CHECK (role IN ('owner', 'barber', 'receptionist')),
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_personnel_lower_email ON personnel (LOWER(email));
CREATE INDEX idx_personnel_role ON personnel (role);

CREATE TABLE platform_admins (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL,
    phone         VARCHAR(20)   NOT NULL,
    password_hash TEXT          NOT NULL,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_platform_admins_lower_email ON platform_admins (LOWER(email));

-- 2) Copy data from legacy users (IDs unchanged)
INSERT INTO customers (id, name, email, phone, password_hash, firebase_uid, is_active, created_at, updated_at)
SELECT id, name, email, phone, password_hash, firebase_uid, is_active, created_at, updated_at
FROM users
WHERE role = 'customer';

INSERT INTO personnel (id, name, email, phone, password_hash, role, is_active, created_at, updated_at)
SELECT id, name, email, phone, password_hash, role, is_active, created_at, updated_at
FROM users
WHERE role IN ('owner', 'barber', 'receptionist');

INSERT INTO platform_admins (id, name, email, phone, password_hash, is_active, created_at, updated_at)
SELECT id, name, email, phone, password_hash, is_active, created_at, updated_at
FROM users
WHERE role = 'super_admin';

-- 3) Refresh tokens: principal kind + rename column (drop FK via global step below)
ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS principal_kind VARCHAR(30);

UPDATE refresh_tokens rt
SET principal_kind = CASE u.role
    WHEN 'customer' THEN 'customer'
    WHEN 'super_admin' THEN 'platform_admin'
    ELSE 'personnel'
END
FROM users u
WHERE u.id = rt.user_id;

UPDATE refresh_tokens SET principal_kind = 'personnel' WHERE principal_kind IS NULL;

ALTER TABLE refresh_tokens ALTER COLUMN principal_kind SET NOT NULL;

-- 4) Notifications: recipient kind (no FK to a single table — composite logical recipient)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_kind VARCHAR(30);

UPDATE notifications n
SET recipient_kind = CASE u.role
    WHEN 'customer' THEN 'customer'
    WHEN 'super_admin' THEN 'platform_admin'
    ELSE 'personnel'
END
FROM users u
WHERE u.id = n.recipient_id;

UPDATE notifications SET recipient_kind = 'personnel' WHERE recipient_kind IS NULL AND recipient_id IS NOT NULL;
UPDATE notifications SET recipient_kind = 'customer' WHERE recipient_kind IS NULL;

ALTER TABLE notifications ALTER COLUMN recipient_kind SET NOT NULL;
ALTER TABLE notifications
    ADD CONSTRAINT notifications_recipient_kind_check
    CHECK (recipient_kind IN ('customer', 'personnel', 'platform_admin'));

-- 5) Drop every FK that references public.users
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN
        SELECT c.conname AS cname, c.conrelid::regclass AS tbl
        FROM pg_constraint c
        WHERE c.confrelid = 'public.users'::regclass
          AND c.contype = 'f'
    LOOP
        EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I', r.tbl, r.cname);
    END LOOP;
END $$;

DROP INDEX IF EXISTS uq_users_phone_non_empty;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
DROP TABLE users;

-- 6) Rename refresh token subject column
ALTER TABLE refresh_tokens RENAME COLUMN user_id TO principal_id;
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_principal
    ON refresh_tokens (principal_id, principal_kind);

-- 7) Re-create foreign keys to new identity tables
ALTER TABLE salons
    ADD CONSTRAINT salons_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES personnel (id) ON DELETE CASCADE;

ALTER TABLE staff
    ADD CONSTRAINT staff_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES personnel (id) ON DELETE CASCADE;

ALTER TABLE reservations
    ADD CONSTRAINT reservations_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE;

ALTER TABLE owner_applications
    ADD CONSTRAINT owner_applications_reviewed_by_fkey
    FOREIGN KEY (reviewed_by_user_id) REFERENCES platform_admins (id) ON DELETE SET NULL;

ALTER TABLE owner_applications
    ADD CONSTRAINT owner_applications_approved_owner_fkey
    FOREIGN KEY (approved_owner_user_id) REFERENCES personnel (id) ON DELETE SET NULL;

-- 8) Triggers for updated_at on new tables
DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_personnel_updated_at ON personnel;
CREATE TRIGGER trg_personnel_updated_at
    BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_platform_admins_updated_at ON platform_admins;
CREATE TRIGGER trg_platform_admins_updated_at
    BEFORE UPDATE ON platform_admins
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
