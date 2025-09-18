SELECT 
    DATE(a."start") AS day,
    COUNT(*) AS songs_played,
    ARRAY_AGG(DISTINCT s.album) AS albums,
    ARRAY_AGG(DISTINCT s."image") AS images
FROM activites a
LEFT JOIN songs s
  ON a.song = s.name
  AND a.artist = s.artist
WHERE a."start" >= NOW() - INTERVAL '365 days'
GROUP BY day
ORDER BY day ASC;
