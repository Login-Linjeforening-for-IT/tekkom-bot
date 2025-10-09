INSERT INTO songs (id, "name", artist, album, "image")
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT ("name", artist, album)
DO UPDATE 
    SET listens = songs.listens + 1,
        "image" = EXCLUDED."image"
RETURNING id;
