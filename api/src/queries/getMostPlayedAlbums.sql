SELECT 
    al.name AS album,
    ar.name AS artist,
    COUNT(*)::INT AS listens,
    s_top.name AS top_song,
    s_top."image" AS top_song_image,
    s_top.album,
    s_top.id AS top_song_id
FROM listens l
JOIN songs s ON l.song_id = s.id
JOIN albums al ON s.album = al.id
JOIN artists ar ON s.artist = ar.id
JOIN LATERAL (
    SELECT s2.name, s2."image", s2.album, s2.id
    FROM listens l2
    JOIN songs s2 ON l2.song_id = s2.id
    WHERE s2.album = s.album AND s2.artist = s.artist
    GROUP BY s2.name, s2."image", s2.album, s2.id
    ORDER BY COUNT(l2.*) DESC
    LIMIT 1
) AS s_top ON true
GROUP BY al.name, ar.name, s_top.name, s_top."image", s_top.album, s_top.id
ORDER BY listens DESC
LIMIT 5;
