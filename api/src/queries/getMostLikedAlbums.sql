SELECT
    al.name AS album,
    ar.name AS artist,
    s_top."image",
    s_top.album,
    s.id,
    SUM(s.listens) AS total_listens,
    SUM(s.skips) AS total_skips,
    (SUM(s.listens)::float / NULLIF(SUM(s.listens + s.skips), 0)) AS like_ratio
FROM songs s
JOIN albums al ON s.album = al.id
JOIN artists ar ON s.artist = ar.id
JOIN LATERAL (
    SELECT *
    FROM songs s2
    WHERE s2.album = s.album AND s2.artist = s.artist
    ORDER BY s2.listens DESC
    LIMIT 1
) AS s_top ON true
GROUP BY al.name, ar.name, s_top."image", s_top.album, s.id
HAVING SUM(s.listens) >= 10
   AND SUM(s.skips) >= 5
ORDER BY like_ratio DESC
LIMIT 5;
