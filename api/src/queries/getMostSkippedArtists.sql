WITH artist_skips AS (
    SELECT 
        a.artist,
        SUM(CASE WHEN a.skipped THEN 1 ELSE 0 END) AS skips
    FROM activities a
    GROUP BY a.artist
),
top_songs AS (
    SELECT DISTINCT ON (s.artist)
        s.artist,
        s.name AS top_song,
        s.album,
        s."image",
        s.artist_id,
        s.sync_id
    FROM songs s
    JOIN activities a 
      ON s.name = a.song AND s.artist = a.artist
    ORDER BY s.artist, COUNT(a.*) OVER (PARTITION BY s.artist, s.name) DESC
)
SELECT 
    ak.artist,
    ak.skips,
    ts.top_song,
    ts.album,
    ts."image",
    ts.artist_id,
    ts.sync_id
FROM artist_skips ak
LEFT JOIN top_songs ts ON ak.artist = ts.artist
ORDER BY ak.skips DESC
LIMIT 5;
