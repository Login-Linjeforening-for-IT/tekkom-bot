SELECT 
    l.id, 
    s.name AS song_name, 
    ar.name AS artist_name, 
    al.name AS album_name, 
    s.id
FROM listens l
JOIN songs s ON l.song_id = s.id
JOIN artists ar ON s.artist = ar.id
JOIN albums al ON s.album = al.id
WHERE l.user_id = $1::TEXT
ORDER BY l.timestamp DESC
LIMIT 1;
