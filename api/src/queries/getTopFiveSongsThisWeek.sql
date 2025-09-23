SELECT s.name AS song, s.artist, s.album, s."image", s.sync_id, COUNT(*) AS listens
FROM activities a
JOIN songs s ON a.song = s.name AND a.artist = s.artist AND a.album = s.album
WHERE DATE_TRUNC('week', a."start") = DATE_TRUNC('week', CURRENT_DATE) AND NOT a.skipped
GROUP BY s.name, s.artist, s.album, s."image", s.sync_id
ORDER BY listens DESC
LIMIT 5;
