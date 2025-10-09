SELECT 
    s.name AS "name", 
    ar.name AS artist, 
    al.name AS album, 
    s.listens, 
    s."image", 
    s.id
FROM songs s
JOIN artists ar ON s.artist = ar.id
JOIN albums al ON s.album = al.id
ORDER BY s.listens DESC
LIMIT 5;
