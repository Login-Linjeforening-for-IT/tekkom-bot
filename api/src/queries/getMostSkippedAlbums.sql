WITH top_songs AS (
    SELECT DISTINCT ON (s.album, s.artist)
        s.album,
        s.artist,
        s.name AS top_song,
        s."image" AS top_song_image,
        s.album_id,
        s.sync_id,
        COUNT(a2.*) AS play_count
    FROM songs s
    JOIN activities a2
        ON s.name = a2.song
        AND s.artist = a2.artist
        AND s.album = a2.album
    GROUP BY s.album, s.artist, s.name, s."image", s.album_id, s.sync_id
    ORDER BY s.album, s.artist, COUNT(a2.*) DESC
)
SELECT
    a.album,
    a.artist,
    SUM(CASE WHEN a.skipped THEN 1 ELSE 0 END) AS skips,
    t.top_song,
    t.top_song_image,
    t.album_id,
    t.sync_id
FROM activities a
JOIN top_songs t
    ON a.album = t.album AND a.artist = t.artist
GROUP BY a.album, a.artist, t.top_song, t.top_song_image, t.album_id, t.sync_id
ORDER BY skips DESC
LIMIT 5;
