SELECT 
    a.album,
    a.artist,
    COUNT(*) AS listens,
    s_top.name AS top_song,
    s_top."image" AS top_song_image,
    s_top.album_id,
    s_top.sync_id
FROM activities a
JOIN LATERAL (
    SELECT s.name, s."image", s.album_id, s.sync_id
    FROM songs s
    JOIN activities a2
      ON s.name = a2.song AND s.artist = a2.artist AND s.album = a2.album
    WHERE s.album = a.album AND s.artist = a.artist
    GROUP BY s.name, s."image", s.album_id, s.sync_id
    ORDER BY COUNT(a2.*) DESC
    LIMIT 1
) AS s_top ON true
GROUP BY a.album, a.artist, s_top.name, s_top."image", s_top.album_id, s_top.sync_id
ORDER BY listens DESC
LIMIT 5;
