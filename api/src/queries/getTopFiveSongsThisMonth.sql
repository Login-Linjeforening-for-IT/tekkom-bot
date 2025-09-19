SELECT s.name AS song, s.artist, s.album, s."image", COUNT(*) AS listens
FROM activites a
JOIN songs s ON a.song = s.name AND a.artist = s.artist AND a.album = s.album
WHERE DATE_TRUNC('month', a."start") = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY s.name, s.artist, s.album, s."image"
ORDER BY listens DESC
LIMIT 5;
