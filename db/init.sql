DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tekkom') THEN
        CREATE DATABASE tekkom;
    END IF;
END $$;

\c tekkom

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tekkom') THEN
        CREATE USER tekkom WITH ENCRYPTED PASSWORD 'tekkom';
        GRANT ALL PRIVILEGES ON DATABASE tekkom TO tekkom;
    END IF;
END $$;

-- Scheduled messages
CREATE TABLE IF NOT EXISTS schedule (
    name TEXT PRIMARY KEY
);

-- Scheduled alerts
CREATE TABLE IF NOT EXISTS alerts (
    name TEXT PRIMARY KEY
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id NUMBER PRIMARY KEY
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    channel TEXT NOT NULL,
    embed BOOLEAN,
    COLOR TEXT,
    INTERVAL TEXT,
    TIME TEXT,
    sent BOOLEAN false
);
