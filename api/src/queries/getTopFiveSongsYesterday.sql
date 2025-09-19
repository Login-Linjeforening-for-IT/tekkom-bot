SELECT s.name AS song, s.artist, s.album, s."image", COUNT(*) AS play_count
FROM activites a
JOIN songs s ON a.song = s.name AND a.artist = s.artist AND a.album = s.album
WHERE a."start"::date = CURRENT_DATE - INTERVAL '1 day'
GROUP BY s.name, s.artist, s.album
ORDER BY play_count DESC
LIMIT 5;
