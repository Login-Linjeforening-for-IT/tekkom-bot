SELECT 
    ar.name AS artist,
    s_top."image",
    s.id,
    SUM(s.listens) AS total_listens,
    SUM(s.skips) AS total_skips,
    (SUM(s.listens)::float / NULLIF(SUM(s.listens + s.skips), 0)) AS like_ratio
FROM songs s
JOIN artists ar ON s.artist = ar.id
JOIN LATERAL (
    SELECT s2."image", s2.id
    FROM songs s2
    WHERE s2.artist = s.artist
    ORDER BY s2.listens DESC
    LIMIT 1
) AS s_top ON true
GROUP BY ar.name, s_top."image", s.id
HAVING SUM(s.listens) >= 10
   AND SUM(s.skips) >= 5
ORDER BY like_ratio DESC
LIMIT 5;
