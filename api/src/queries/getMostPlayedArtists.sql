WITH artist_counts AS (
    SELECT 
        a.artist,
        COUNT(*) AS play_count
    FROM activites a
    GROUP BY a.artist
),
top_songs AS (
    SELECT DISTINCT ON (s.artist)
        s.artist,
        s.name AS top_song,
        s.album,
        s."image"
    FROM songs s
    JOIN activites a 
      ON s.name = a.song AND s.artist = a.artist
    ORDER BY s.artist, COUNT(a.*) OVER (PARTITION BY s.artist, s.name) DESC
)
SELECT 
    ac.artist,
    ac.play_count,
    ts.top_song,
    ts.album,
    ts."image"
FROM artist_counts ac
LEFT JOIN top_songs ts ON ac.artist = ts.artist
ORDER BY ac.play_count DESC
LIMIT 5;
