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
    roles TEXT[],
    embed BOOLEAN,
    color TEXT,
    interval TEXT,
    time TIMESTAMPTZ,
    sent BOOLEAN DEFAULT false,
    last_sent TIMESTAMPTZ
);

-- Btg
CREATE TABLE IF NOT EXISTS btg (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    author TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    song TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    "start" TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL,
    "user" TEXT NOT NULL,
    avatar TEXT NOT NULL,
    user_id TEXT NOT NULL,
    skipped BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Songs 
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    "image" TEXT NOT NULL,
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (name, artist, album)
);

-- Artists 
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Hidden 
CREATE TABLE IF NOT EXISTS "hidden" (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);
