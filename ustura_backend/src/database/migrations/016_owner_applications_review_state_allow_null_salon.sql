-- ============================================================
-- USTURA — owner_applications review CHECK gevsemesi
-- Dosya  : 016_owner_applications_review_state_allow_null_salon.sql
-- Notlar : Onayli basvuruda salon silindiginde approved_salon_id
--          NULL olabilmeli (super-admin salon silme + FK SET NULL).
-- ============================================================

ALTER TABLE owner_applications
    DROP CONSTRAINT IF EXISTS chk_owner_applications_review_state;

ALTER TABLE owner_applications
    ADD CONSTRAINT chk_owner_applications_review_state
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
            AND approved_owner_user_id IS NOT NULL)
        OR
        (status = 'rejected'
            AND reviewed_at IS NOT NULL
            AND reviewed_by_user_id IS NOT NULL
            AND rejection_reason IS NOT NULL
            AND approved_owner_user_id IS NULL
            AND approved_salon_id IS NULL)
    );
