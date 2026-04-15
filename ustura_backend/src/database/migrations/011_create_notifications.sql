CREATE TABLE IF NOT EXISTS notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID REFERENCES users (id) ON DELETE CASCADE,
    key             VARCHAR(100) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    tone            VARCHAR(20) NOT NULL DEFAULT 'primary'
                    CHECK (tone IN ('success', 'warning', 'error', 'primary')),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id
    ON notifications (recipient_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
    ON notifications (is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_key
    ON notifications (key);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at_desc
    ON notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread
    ON notifications (recipient_id, is_read)
    WHERE is_read = FALSE;
