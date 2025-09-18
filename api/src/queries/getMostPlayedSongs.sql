SELECT s.name AS song, s.artist, s.album, s.listens
FROM songs s
ORDER BY s.listens DESC
LIMIT 5;
