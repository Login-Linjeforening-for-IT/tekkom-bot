SELECT 
    "user" AS name,
    avatar,
    user_id,
    COUNT(*) AS songs_played
FROM activities
GROUP BY user_id, "user", avatar
ORDER BY songs_played DESC
LIMIT 100;
