SELECT 
    a.artist,
    s."image",
    SUM(s.listens) AS total_listens,
    SUM(s.skips) AS total_skips,
    (SUM(s.listens)::float / NULLIF(SUM(s.listens + s.skips), 0)) AS like_ratio
FROM songs s
JOIN activities a
  ON s.name = a.song AND s.artist = a.artist
GROUP BY a.artist, s."image"
HAVING SUM(s.listens) >= 10
   AND SUM(s.skips) >= 1
ORDER BY like_ratio DESC
LIMIT 5;
