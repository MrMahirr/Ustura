CREATE TABLE IF NOT EXISTS audit_logs (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id  UUID REFERENCES users (id) ON DELETE SET NULL,
    actor_role     VARCHAR(20)
                   CHECK (
                     actor_role IS NULL OR actor_role IN (
                       'super_admin',
                       'owner',
                       'barber',
                       'receptionist',
                       'customer'
                     )
                   ),
    action         VARCHAR(100) NOT NULL,
    entity_type    VARCHAR(100) NOT NULL,
    entity_id      UUID,
    metadata       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id
    ON audit_logs (actor_user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs (action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type
    ON audit_logs (entity_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id
    ON audit_logs (entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc
    ON audit_logs (created_at DESC);
