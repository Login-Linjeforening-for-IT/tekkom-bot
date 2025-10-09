UPDATE songs
SET listens = GREATEST(listens - 1, 0),
    skips = skips + 1,
    id = COALESCE($4, id),
    artist = COALESCE($5, artist),
    album = COALESCE($6, album)
WHERE name = $1 AND artist = $2 AND album = $3;
