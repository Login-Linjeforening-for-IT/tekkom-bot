SELECT 
    s.name AS song, 
    s.artist, 
    s.album, 
    s."image", 
    COUNT(*) AS listens
FROM activities a
JOIN songs s 
    ON a.song = s.name 
   AND a.artist = s.artist 
   AND a.album = s.album
WHERE DATE_TRUNC('year', a."start") = DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year') AND NOT a.skipped
GROUP BY s.name, s.artist, s.album, s."image"
ORDER BY listens DESC
LIMIT 5;
