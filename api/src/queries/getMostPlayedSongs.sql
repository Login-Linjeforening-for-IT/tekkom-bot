SELECT s.name AS song, s.artist, s.album, s.listens, s."image"
FROM songs s
ORDER BY s.listens DESC
LIMIT 5;
