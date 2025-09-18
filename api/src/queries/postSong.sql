INSERT INTO songs (name, artist, album, image)
VALUES ($1, $2, $3, $4)
ON CONFLICT (name, artist, album)
DO UPDATE SET
    listens = songs.listens + 1,
    timestamp = NOW();