WITH daily_counts AS (
    SELECT 
        DATE(a."start") AS day,
        s.name AS song,
        s.artist,
        s.album,
        s."image",
        COUNT(*) AS listens
    FROM activities a
    JOIN songs s 
      ON a.song = s.name
     AND a.artist = s.artist
    WHERE a."start" >= NOW() - INTERVAL '365 days' AND NOT a.skipped
    GROUP BY day, s.name, s.artist, s.album, s."image"
),
ranked AS (
    SELECT 
        day, song, artist, album, "image", listens,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY listens DESC) AS rn,
        SUM(listens) OVER (PARTITION BY day) AS total_songs_played
    FROM daily_counts
)
SELECT day, song, artist, album, "image", listens, total_songs_played
FROM ranked
WHERE rn = 1
ORDER BY day ASC;
