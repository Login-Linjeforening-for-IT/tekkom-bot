WITH daily_counts AS (
    SELECT 
        DATE(l."start") AS day,
        s.name AS song,
        ar.name AS artist,
        al.name AS album,
        s."image",
        s.id,
        COUNT(*)::INT AS listens
    FROM listens l
    JOIN songs s ON l.song_id = s.id
    JOIN artists ar ON s.artist = ar.id
    JOIN albums al ON s.artist = al.id
    WHERE l."start" >= NOW() - INTERVAL '365 days'
      AND NOT l.skipped
    GROUP BY day, s.name, ar.name, al.name, s."image", s.id
),
ranked AS (
    SELECT 
        day, song, artist, album, "image", listens, id,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY listens DESC) AS rn,
        SUM(listens)::INT OVER (PARTITION BY day) AS total_songs_played
    FROM daily_counts
)
SELECT day, song, artist, album, "image", listens, total_songs_played, id
FROM ranked
WHERE rn = 1
ORDER BY day ASC;
