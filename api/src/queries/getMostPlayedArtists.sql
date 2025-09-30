WITH artist_counts AS (
    SELECT 
        a.artist,
        COUNT(*)::INT AS listens
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
    ac.artist,
    ac.listens,
    ts.top_song,
    ts.album,
    ts."image",
    ts.artist_id,
    ts.sync_id
FROM artist_counts ac
LEFT JOIN top_songs ts ON ac.artist = ts.artist
ORDER BY ac.listens DESC
LIMIT 5;
