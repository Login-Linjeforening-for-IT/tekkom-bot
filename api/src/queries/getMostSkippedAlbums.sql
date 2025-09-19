SELECT 
    a.album,
    a.artist,
    SUM(CASE WHEN a.skipped THEN 1 ELSE 0 END) AS skips,
    s_top.name AS top_song,
    s_top."image" AS top_song_image
FROM activities a
JOIN LATERAL (
    SELECT s.name, s."image"
    FROM songs s
    JOIN activities a2
      ON s.name = a2.song AND s.artist = a2.artist AND s.album = a2.album
    WHERE s.album = a.album AND s.artist = a.artist
    GROUP BY s.name, s."image"
    ORDER BY COUNT(a2.*) DESC
    LIMIT 1
) AS s_top ON true
GROUP BY a.album, a.artist, s_top.name, s_top."image"
ORDER BY skips DESC
LIMIT 5;
