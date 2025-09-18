SELECT s.name AS song, s.artist, s.album, COUNT(*) AS play_count
FROM activites a
JOIN songs s ON a.song = s.name AND a.artist = s.artist AND a.album = s.album
WHERE DATE_TRUNC('year', a."start") = DATE_TRUNC('year', CURRENT_DATE)
GROUP BY s.name, s.artist, s.album
ORDER BY play_count DESC
LIMIT 5;
