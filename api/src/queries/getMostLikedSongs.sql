SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s.skips, 
    s.listens,
    s.sync_id,
    s."image",
    (s.listens::float / NULLIF(s.listens + s.skips, 0)) AS like_ratio
FROM songs s
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
WHERE s.listens >= 10
  AND s.skips >= 5
ORDER BY like_ratio DESC
LIMIT 5;
