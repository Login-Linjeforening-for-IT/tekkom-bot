SELECT * FROM (
    SELECT DISTINCT ON (ga.user_id)
        ga.*,
        g.name AS game_name,
        g.image AS game_image,
        g.players,
        g.image_text
    FROM game_activity ga
    LEFT JOIN games g ON ga.game_id = g.id
    WHERE ga."end" >= NOW() - INTERVAL '2 minutes'
    ORDER BY ga.user_id, ga."start" DESC
) AS per_user
ORDER BY (NOW() - per_user."start") ASC;
