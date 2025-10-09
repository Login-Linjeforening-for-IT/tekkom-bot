SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s."image",
    s.id,
    COUNT(*)::INT AS listens
FROM listens l
JOIN songs s ON l.song_id = s.id
JOIN artists ar ON s.artist = ar.id
JOIN albums al ON s.album = al.id
WHERE l."start"::date = CURRENT_DATE - INTERVAL '1 day'
  AND NOT l.skipped
GROUP BY s.name, ar.name, al.name, s."image", s.id
ORDER BY listens DESC
LIMIT 5;
