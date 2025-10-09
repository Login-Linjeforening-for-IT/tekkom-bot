UPDATE songs
SET listens = GREATEST(listens - 1, 0),
    skips = skips + 1,
    sync_id = COALESCE($4, sync_id),
    artist_id = COALESCE($5, artist_id),
    album_id = COALESCE($6, album_id)
WHERE name = $1 AND artist = $2 AND album = $3;
