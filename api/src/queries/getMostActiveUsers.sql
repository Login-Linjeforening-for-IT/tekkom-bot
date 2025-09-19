SELECT 
    CASE WHEN h.name IS NOT NULL THEN 'Ghost' ELSE a."user" END AS name,
    CASE WHEN h.name IS NOT NULL THEN '355e71a6a8b57bc3e292d08e2f09f04c' ELSE a.avatar END AS avatar,
    CASE WHEN h.name IS NOT NULL THEN '951849546286239794' ELSE a.user_id END AS user_id,
    COUNT(*) AS songs_played
FROM activities a
LEFT JOIN hidden h
    ON h.name = a."user"
GROUP BY user_id, "user", avatar, h.name
ORDER BY songs_played DESC
LIMIT 100;
