-- ============================================================
-- USTURA - Migration 007
-- Dosya  : 007_enforce_user_phone_uniqueness.sql
-- Notlar : Empty phone values remain allowed for selected customer flows,
--          but non-empty phone values must be unique application-wide.
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_phone_non_empty
    ON users (phone)
    WHERE phone <> '';
