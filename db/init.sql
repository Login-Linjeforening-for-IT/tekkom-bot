DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tekkom-bot') THEN
        CREATE DATABASE "tekkom-bot";
    END IF;
END $$;

\c "tekkom-bot"

DO $$
DECLARE
    user_password text;
BEGIN
    user_password := current_setting('db_password', true);

    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tekkom-bot') THEN
        EXECUTE format('CREATE USER "tekkom-bot" WITH ENCRYPTED PASSWORD %L', user_password);
        EXECUTE 'GRANT ALL PRIVILEGES ON DATABASE "tekkom-bot" TO "tekkom-bot"';
    END IF;
END $$;

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    channel TEXT NOT NULL,
    embed BOOLEAN,
    color TEXT,
    interval TEXT,
    time TIMESTAMPTZ,
    sent BOOLEAN DEFAULT false,
    last_sent TIMESTAMPTZ
);
