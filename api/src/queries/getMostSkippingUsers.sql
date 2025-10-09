SELECT 
    CASE WHEN h.name IS NOT NULL THEN 'Ghost' ELSE u."name" END AS name,
    CASE WHEN h.name IS NOT NULL THEN '355e71a6a8b57bc3e292d08e2f09f04c' ELSE u.avatar END AS avatar,
    CASE WHEN h.name IS NOT NULL THEN '951849546286239794' ELSE u.id END AS user_id,
    COUNT(*)::INT AS songs_skipped
FROM listens l
JOIN users u ON l.user_id = u.id
LEFT JOIN hidden h ON h.name = u."name"
WHERE l.skipped = true
GROUP BY u.id, u."name", u.avatar, h.name
ORDER BY songs_skipped DESC
LIMIT 5;
