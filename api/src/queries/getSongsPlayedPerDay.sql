WITH daily_counts AS (
    SELECT 
        DATE(l.start_time) AS day,
        s.name AS song,
        ar.name AS artist,
        al.name AS album,
        s."image",
        s.sync_id,
        COUNT(*)::INT AS listens
    FROM listens l
    JOIN songs s ON l.song_id = s.id
    JOIN artists ar ON s.artist_id = ar.id
    JOIN albums al ON s.album_id = al.id
    WHERE l.start_time >= NOW() - INTERVAL '365 days'
      AND NOT l.skipped
    GROUP BY day, s.name, ar.name, al.name, s."image", s.sync_id
),
ranked AS (
    SELECT 
        day, song, artist, album, "image", listens, sync_id,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY listens DESC) AS rn,
        SUM(listens) OVER (PARTITION BY day) AS total_songs_played
    FROM daily_counts
)
SELECT day, song, artist, album, "image", listens, total_songs_played, sync_id
FROM ranked
WHERE rn = 1
ORDER BY day ASC;
