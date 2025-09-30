WITH top_songs AS (
    SELECT DISTINCT ON (s.album_id, s.artist_id)
        s.album_id,
        s.artist_id,
        s.name AS top_song,
        s."image" AS top_song_image,
        s.sync_id,
        COUNT(a2.*) AS play_count
    FROM songs s
    JOIN activities a2
        ON a2.song_id = s.id
    GROUP BY s.album_id, s.artist_id, s.name, s."image", s.sync_id
    ORDER BY s.album_id, s.artist_id, COUNT(a2.*) DESC
)
SELECT
    al.name AS album,
    ar.name AS artist,
    SUM(CASE WHEN a.skipped THEN 1 ELSE 0 END) AS skips,
    t.top_song,
    t.top_song_image,
    t.album_id,
    t.sync_id
FROM activities a
JOIN songs s ON a.song_id = s.id
JOIN albums al ON s.album_id = al.id
JOIN artists ar ON s.artist_id = ar.id
JOIN top_songs t
    ON s.album_id = t.album_id AND s.artist_id = t.artist_id
GROUP BY al.name, ar.name, t.top_song, t.top_song_image, t.album_id, t.sync_id
ORDER BY skips DESC
LIMIT 5;
