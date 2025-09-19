SELECT s.name AS song, s.artist, s.album, s.skips, s."image"
FROM songs s
ORDER BY s.skips DESC
LIMIT 5;
