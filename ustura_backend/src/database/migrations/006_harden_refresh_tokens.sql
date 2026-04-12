ALTER TABLE refresh_tokens
ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS rotated_from UUID REFERENCES refresh_tokens (id) ON DELETE SET NULL;

UPDATE refresh_tokens
SET revoked_at = COALESCE(revoked_at, created_at)
WHERE revoked = TRUE
  AND revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_revoked_at
ON refresh_tokens (revoked_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_rotated_from
ON refresh_tokens (rotated_from);
