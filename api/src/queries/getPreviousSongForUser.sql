SELECT 
    l.id, 
    s.name AS song_name, 
    ar.name AS artist_name, 
    al.name AS album_name, 
    s.sync_id
FROM listens l
JOIN songs s ON l.song_id = s.id
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
WHERE l.user_id = $1::TEXT
ORDER BY l.timestamp DESC
LIMIT 1;
