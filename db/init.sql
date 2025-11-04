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

-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    avatar TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- Artists 
CREATE TABLE IF NOT EXISTS artists (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Albums
CREATE TABLE IF NOT EXISTS albums (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    PRIMARY KEY (id)
);

-- Songs 
CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    artist TEXT NOT NULL REFERENCES artists(id),
    album TEXT NOT NULL REFERENCES albums(id),
    "image" TEXT NOT NULL,
    type TEXT DEFAULT 'track',
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Listens
CREATE TABLE IF NOT EXISTS listens (
    id SERIAL PRIMARY KEY,
    song_id TEXT NOT NULL REFERENCES songs(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    "start" TIMESTAMPTZ NOT NULL,
    "end" TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL,
    skipped BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

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

-- Games
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    image TEXT,
    players INT DEFAULT 1,
    image_text TEXT
);

-- Game Activity
CREATE TABLE IF NOT EXISTS game_activity (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    details TEXT,
    state TEXT,
    application TEXT,
    "start" TIMESTAMPTZ NOT NULL,
    "end"  TIMEStAMPTZ NOT NULL,
    party TEXT
);

-- Hidden 
CREATE TABLE IF NOT EXISTS "hidden" (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Optimalizations
CREATE INDEX idx_listens_timestamp_desc ON listens ("timestamp" DESC);

CREATE INDEX idx_songs_listens_skips
ON songs (listens, skips);

CREATE INDEX idx_user_listens
ON listens (user_id, skipped);

CREATE INDEX idx_announcements_interval_sent_time 
ON announcements (interval, sent, "time");

CREATE INDEX idx_listens_start_not_skipped 
ON listens ("start") WHERE NOT skipped;

CREATE INDEX idx_listens_not_skipped 
ON listens (skipped) WHERE skipped = false;

CREATE INDEX idx_listens_active_now
ON listens ("user_id", "start", "end", skipped);

-- For top songs per artist queries
CREATE INDEX idx_songs_name_artist_album ON songs (name, artist, album);

-- For queries ordering by listens or skips
CREATE INDEX idx_songs_listens_desc ON songs (listens DESC);
CREATE INDEX idx_songs_skips_desc ON songs (skips DESC);

-- For queries combining artist with listens
CREATE INDEX idx_songs_artist_listens_desc ON songs (artist, listens DESC);
CREATE INDEX idx_songs_artist_skips_desc ON songs (artist, skips DESC);
CREATE INDEX idx_artists_listens_desc ON artists (listens DESC);
CREATE INDEX idx_artists_skips_desc ON artists (skips DESC);

-- Unique ids if not unknown
CREATE UNIQUE INDEX IF NOT EXISTS artists_unique_id
ON artists(id) WHERE id <> 'Unknown';

CREATE UNIQUE INDEX IF NOT EXISTS albums_unique_id
ON albums(id) WHERE id <> 'Unknown';

-- Number of helper functions per query to increase performance
SET max_parallel_workers_per_gather = 4;
