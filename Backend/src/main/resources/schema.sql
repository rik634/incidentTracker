DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_severity') THEN
        CREATE TYPE incident_severity AS ENUM ('SEV1', 'SEV2', 'SEV3', 'SEV4');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
        CREATE TYPE incident_status AS ENUM ('OPEN', 'MITIGATED', 'RESOLVED');
    END IF;
END $$;
^^

DROP TABLE IF EXISTS incidents;
^^

CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    severity incident_severity NOT NULL,
    status incident_status NOT NULL DEFAULT 'OPEN',
    owner VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
^^

-- Add ^^ after your INDEX and EXTENSION statements as well...

-- Optimized for the filter bar shown in the wireframe
CREATE INDEX IF NOT EXISTS idx_search_filters ON incidents(service, status, severity);
CREATE INDEX IF NOT EXISTS idx_title_search ON incidents(title);