SELECT 
    s.name AS "name", 
    ar.name AS artist, 
    al.name AS album, 
    s.listens, 
    s."image", 
    s.sync_id
FROM songs s
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
ORDER BY s.listens DESC
LIMIT 5;
