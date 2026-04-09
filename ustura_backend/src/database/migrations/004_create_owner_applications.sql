-- ============================================================
-- USTURA - Owner applications
-- Dosya  : 004_create_owner_applications.sql
-- Notlar : Super-admin approval flow for owner onboarding.
-- ============================================================

ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL;

CREATE TABLE IF NOT EXISTS owner_applications (
    id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name          VARCHAR(100)  NOT NULL,
    applicant_email         VARCHAR(150)  NOT NULL,
    applicant_phone         VARCHAR(20)   NOT NULL,
    password_hash           TEXT          NOT NULL,
    salon_name              VARCHAR(150)  NOT NULL,
    salon_address           TEXT          NOT NULL,
    salon_city              VARCHAR(80)   NOT NULL,
    salon_district          VARCHAR(80),
    salon_photo_url         TEXT,
    salon_working_hours     JSONB         NOT NULL DEFAULT '{}',
    status                  VARCHAR(20)   NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'approved', 'rejected')),
    notes                   TEXT,
    reviewed_at             TIMESTAMPTZ,
    reviewed_by_user_id     UUID REFERENCES users (id) ON DELETE SET NULL,
    rejection_reason        TEXT,
    approved_owner_user_id  UUID REFERENCES users (id) ON DELETE SET NULL,
    approved_salon_id       UUID REFERENCES salons (id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_owner_applications_review_state
        CHECK (
            (status = 'pending'
                AND reviewed_at IS NULL
                AND reviewed_by_user_id IS NULL
                AND rejection_reason IS NULL
                AND approved_owner_user_id IS NULL
                AND approved_salon_id IS NULL)
            OR
            (status = 'approved'
                AND reviewed_at IS NOT NULL
                AND reviewed_by_user_id IS NOT NULL
                AND rejection_reason IS NULL
                AND approved_owner_user_id IS NOT NULL
                AND approved_salon_id IS NOT NULL)
            OR
            (status = 'rejected'
                AND reviewed_at IS NOT NULL
                AND reviewed_by_user_id IS NOT NULL
                AND rejection_reason IS NOT NULL
                AND approved_owner_user_id IS NULL
                AND approved_salon_id IS NULL)
        )
);

CREATE INDEX IF NOT EXISTS idx_owner_applications_status
    ON owner_applications (status);

CREATE INDEX IF NOT EXISTS idx_owner_applications_created_at
    ON owner_applications (created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_owner_applications_pending_email
    ON owner_applications (LOWER(applicant_email))
    WHERE status = 'pending';

DROP TRIGGER IF EXISTS trg_owner_applications_updated_at ON owner_applications;

CREATE TRIGGER trg_owner_applications_updated_at
    BEFORE UPDATE ON owner_applications
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
