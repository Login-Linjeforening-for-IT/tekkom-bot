SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s.skips, 
    s."image", 
    s.sync_id
FROM songs s
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
ORDER BY s.skips DESC
LIMIT 5;
