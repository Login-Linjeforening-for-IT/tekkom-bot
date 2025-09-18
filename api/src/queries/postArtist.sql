INSERT INTO artists (name)
VALUES ($1)
ON CONFLICT (name)
DO UPDATE SET
    listens = artists.listens + 1,
    timestamp = NOW();
