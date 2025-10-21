SELECT 
    g.id,
    g.name AS game,
    g.image,
    g.players,
    g.image_text,
    COUNT(*)::INT AS plays
FROM game_activity ga
JOIN games g ON ga.game_id = g.id
WHERE DATE_TRUNC('year', ga."start") = DATE_TRUNC('year', CURRENT_DATE)
GROUP BY g.id, g.name, g.image, g.players, g.image_text
ORDER BY plays DESC
LIMIT 5;
