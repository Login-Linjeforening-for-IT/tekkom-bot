SELECT l.id, l.song_id
FROM listens l
WHERE l.user_id = $1::TEXT
ORDER BY l.timestamp DESC
LIMIT 1;
