SELECT 
    a.id, 
    s.name AS song_name, 
    ar.name AS artist_name, 
    al.name AS album_name, 
    s.sync_id
FROM activities a
JOIN songs s ON a.song_id = s.id
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
WHERE a.user_id = $1
ORDER BY a.timestamp DESC
LIMIT 1;
