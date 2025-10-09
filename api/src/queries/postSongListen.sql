INSERT INTO songs (name, artist_id, album_id, "image", sync_id)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (name, artist_id, album_id)
DO UPDATE SET listens = songs.listens + 1, sync_id = EXCLUDED.sync_id
RETURNING id;
