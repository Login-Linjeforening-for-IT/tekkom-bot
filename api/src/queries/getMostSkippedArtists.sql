WITH artist_skips AS (
    SELECT 
        s.artist,
        SUM(CASE WHEN l.skipped THEN 1 ELSE 0 END) AS skips
    FROM listens l
    JOIN songs s ON l.song_id = s.id
    GROUP BY s.artist
),
top_songs AS (
    SELECT DISTINCT ON (s.artist)
        s.artist,
        s.name AS top_song,
        al.name AS album,
        s."image",
        s.id
    FROM songs s
    JOIN listens l ON l.song_id = s.id
    JOIN albums al ON s.album = al.id
    ORDER BY s.artist, COUNT(l.*)::INT OVER (PARTITION BY s.artist, s.id) DESC
)
SELECT 
    ar.name AS artist,
    ak.skips,
    ts.top_song,
    ts.album,
    ts."image",
    ts.artist,
    ts.id
FROM artist_skips ak
JOIN artists ar ON ak.artist = ar.id
LEFT JOIN top_songs ts ON ak.artist = ts.artist
ORDER BY ak.skips DESC
LIMIT 5;
