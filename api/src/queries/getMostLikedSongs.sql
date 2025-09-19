SELECT 
    s.name AS song, 
    s.artist, 
    s.album, 
    s.skips, 
    s.listens, 
    s."image",
    (s.listens::float / NULLIF(s.listens + s.skips, 0)) AS like_ratio
FROM songs s
ORDER BY like_ratio DESC
LIMIT 5;
