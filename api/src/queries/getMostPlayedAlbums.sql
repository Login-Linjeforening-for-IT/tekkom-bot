SELECT 
    al.name AS album,
    ar.name AS artist,
    COUNT(*)::INT AS listens,
    s_top.name AS top_song,
    s_top."image" AS top_song_image,
    s_top.album_id,
    s_top.sync_id
FROM activities a
JOIN songs s ON a.song_id = s.id
JOIN albums al ON s.album_id = al.id
JOIN artists ar ON s.artist_id = ar.id
JOIN LATERAL (
    SELECT s2.name, s2."image", s2.album_id, s2.sync_id
    FROM activities a2
    JOIN songs s2 ON a2.song_id = s2.id
    WHERE s2.album_id = s.album_id AND s2.artist_id = s.artist_id
    GROUP BY s2.name, s2."image", s2.album_id, s2.sync_id
    ORDER BY COUNT(a2.*) DESC
    LIMIT 1
) AS s_top ON true
GROUP BY al.name, ar.name, s_top.name, s_top."image", s_top.album_id, s_top.sync_id
ORDER BY listens DESC
LIMIT 5;
