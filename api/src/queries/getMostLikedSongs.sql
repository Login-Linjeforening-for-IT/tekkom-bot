SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s.skips, 
    s.listens,
    s.id,
    s."image",
    (s.listens::float / NULLIF(s.listens + s.skips, 0)) AS like_ratio
FROM songs s
JOIN artists ar ON s.artist = ar.id
JOIN albums al ON s.album = al.id
WHERE s.listens >= 10
  AND s.skips >= 5
ORDER BY like_ratio DESC
LIMIT 5;
