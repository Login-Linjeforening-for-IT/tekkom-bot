WITH artist_skips AS (
    SELECT 
        s.artist_id,
        SUM(CASE WHEN a.skipped THEN 1 ELSE 0 END) AS skips
    FROM activities a
    JOIN songs s ON a.song_id = s.id
    GROUP BY s.artist_id
),
top_songs AS (
    SELECT DISTINCT ON (s.artist_id)
        s.artist_id,
        s.name AS top_song,
        al.name AS album,
        s."image",
        s.sync_id
    FROM songs s
    JOIN activities a ON a.song_id = s.id
    JOIN albums al ON s.album_id = al.id
    ORDER BY s.artist_id, COUNT(a.*) OVER (PARTITION BY s.artist_id, s.id) DESC
)
SELECT 
    ar.name AS artist,
    ak.skips,
    ts.top_song,
    ts.album,
    ts."image",
    ts.artist_id,
    ts.sync_id
FROM artist_skips ak
JOIN artists ar ON ak.artist_id = ar.id
LEFT JOIN top_songs ts ON ak.artist_id = ts.artist_id
ORDER BY ak.skips DESC
LIMIT 5;
