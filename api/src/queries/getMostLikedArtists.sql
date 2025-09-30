SELECT 
    ar.name AS artist,
    s_top."image",
    s_top.artist_id,
    s_top.sync_id,
    SUM(s.listens) AS total_listens,
    SUM(s.skips) AS total_skips,
    (SUM(s.listens)::float / NULLIF(SUM(s.listens + s.skips), 0)) AS like_ratio
FROM songs s
JOIN artists ar ON s.artist_id = ar.id
JOIN LATERAL (
    SELECT s2."image", s2.artist_id, s2.sync_id
    FROM songs s2
    WHERE s2.artist_id = s.artist_id
    ORDER BY s2.listens DESC
    LIMIT 1
) AS s_top ON true
GROUP BY ar.name, s_top."image", s_top.artist_id, s_top.sync_id
HAVING SUM(s.listens) >= 10
   AND SUM(s.skips) >= 5
ORDER BY like_ratio DESC
LIMIT 5;
