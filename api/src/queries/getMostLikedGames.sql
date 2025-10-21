WITH game_counts AS (
    SELECT
        g.id,
        g.name AS game,
        g.image,
        g.players,
        g.image_text,
        COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ga."end" - ga."start")) >= 600) AS plays,       -- sessions >=10 min
        COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (ga."end" - ga."start")) < 600) AS skips       -- sessions <10 min
    FROM game_activity ga
    JOIN games g ON ga.game_id = g.id
    GROUP BY g.id, g.name, g.image, g.players, g.image_text
)
SELECT
    id,
    game,
    image,
    players,
    image_text,
    plays,
    skips,
    (plays::float / NULLIF(plays + skips, 0)) AS like_ratio
FROM game_counts
WHERE plays >= 10 AND skips >= 5
ORDER BY like_ratio DESC
LIMIT 5;
