-- ============================================================
-- USTURA — Optional Firebase Google sign-in for customers
-- Dosya  : 002_add_customer_google_auth.sql
-- Notlar : Customer accounts may use password auth, Firebase Google auth,
--          or both. Existing staff/owner/admin accounts remain password-based.
-- ============================================================

ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid_unique
    ON users (firebase_uid)
    WHERE firebase_uid IS NOT NULL;
