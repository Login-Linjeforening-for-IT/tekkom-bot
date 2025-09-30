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

-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    avatar TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    song_id INT NOT NULL REFERENCES songs(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL,
    skipped BOOLEAN NOT NULL DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Songs 
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    artist_id INT NOT NULL REFERENCES artists(id),
    album_id INT NOT NULL REFERENCES albums(id),
    "image" TEXT NOT NULL,
    sync_id TEXT NOT NULL,
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (name, artist_id, album_id)
);

-- Albums
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Artists 
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    listens INT DEFAULT 1,
    skips INT DEFAULT 0,
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
    start_time TIMESTAMPTZ NOT NULL,
    party TEXT
);

-- Hidden 
CREATE TABLE IF NOT EXISTS "hidden" (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Optimalizations
CREATE INDEX idx_activities_timestamp_desc ON activities ("timestamp" DESC);

CREATE INDEX idx_songs_listens_skips
ON songs (listens, skips);

CREATE INDEX idx_songs_artist_listens_desc
ON songs (artist, listens DESC);

CREATE INDEX idx_songs_skips_desc 
ON songs (skips DESC);

CREATE INDEX idx_activities_user_listens 
ON activities (user_id, skipped);

CREATE INDEX idx_activities_user_skipped 
ON activities (user_id, skipped);

CREATE INDEX idx_announcements_interval_sent_time 
ON announcements (interval, sent, "time");

CREATE INDEX idx_activities_start_not_skipped 
ON activities ("start") WHERE NOT skipped;

CREATE INDEX idx_activities_not_skipped 
ON activities (skipped) WHERE skipped = false;

CREATE INDEX idx_activities_active_now
ON activities ("user_id", "start", "end", skipped);

-- For top songs per artist queries
CREATE INDEX idx_songs_artist_name_album ON songs (artist, name, album);

-- For queries ordering by listens or skips
CREATE INDEX idx_songs_listens_desc ON songs (listens DESC);
CREATE INDEX idx_songs_skips_desc ON songs (skips DESC);

-- For queries combining artist with listens
CREATE INDEX idx_songs_artist_listens_desc ON songs (artist, listens DESC);
CREATE INDEX idx_songs_artist_skips_desc ON songs (artist, skips DESC);

CREATE INDEX idx_artists_listens_desc ON artists (listens DESC);
CREATE INDEX idx_artists_skips_desc ON artists (skips DESC);

-- Requires altering the table, currently not implemented
-- CREATE INDEX idx_activities_start_date_not_skipped 
-- ON activities ("start"::date) WHERE NOT skipped;

-- CREATE INDEX idx_activities_start_month_not_skipped 
-- ON activities (DATE_TRUNC('month', "start")) 
-- WHERE NOT skipped;

-- CREATE INDEX idx_activities_start_week_not_skipped 
-- ON activities (DATE_TRUNC('week', "start")) 
-- WHERE NOT skipped;

-- CREATE INDEX idx_activities_start_year_not_skipped 
-- ON activities (DATE_TRUNC('year', "start")) 
-- WHERE NOT skipped;

-- CREATE INDEX idx_activities_start_year_skipped
-- ON activities ((DATE_TRUNC('year', "start"))) 
-- INCLUDE (skipped, song, artist, album);

-- Number of helper functions per query to increase performance
SET max_parallel_workers_per_gather = 4;
