WITH daily_counts AS (
    SELECT 
        DATE(ga."start") AS day,
        g.name AS game,
        g.image,
        g.players,
        g.image_text,
        g.id,
        COUNT(*)::INT AS plays
    FROM game_activity ga
    JOIN games g ON ga.game_id = g.id
    WHERE ga."start" >= NOW() - INTERVAL '365 days'
    GROUP BY day, g.name, g.image, g.players, g.image_text, g.id
),
ranked AS (
    SELECT 
        day,
        game,
        image,
        players,
        image_text,
        plays,
        id,
        ROW_NUMBER() OVER (PARTITION BY day ORDER BY plays DESC) AS rn,
        SUM(plays) OVER (PARTITION BY day)::INT AS total_games_played
    FROM daily_counts
)
SELECT 
    day,
    game,
    image,
    players,
    image_text,
    plays,
    total_games_played,
    id
FROM ranked
WHERE rn = 1
ORDER BY day ASC;
