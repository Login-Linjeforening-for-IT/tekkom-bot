SELECT 
    g.id,
    g.name,
    g.image,
    COUNT(*)::INT AS short_sessions
FROM game_activity ga
JOIN games g ON ga.game_id = g.id
WHERE EXTRACT(EPOCH FROM (ga."end" - ga."start")) < 600
GROUP BY g.id, g.name, g.image
ORDER BY short_sessions DESC
LIMIT 5;
