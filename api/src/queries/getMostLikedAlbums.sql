SELECT 
    a.album,
    a.artist,
    SUM(s.listens) AS total_listens,
    SUM(s.skips) AS total_skips,
    (SUM(s.listens)::float / NULLIF(SUM(s.listens + s.skips), 0)) AS like_ratio
FROM songs s
JOIN activities a
  ON s.name = a.song AND s.artist = a.artist AND s.album = a.album
GROUP BY a.album, a.artist
ORDER BY like_ratio DESC
LIMIT 5;
