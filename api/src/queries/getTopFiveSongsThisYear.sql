SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s."image",
    s.sync_id,
    COUNT(*)::INT AS listens
FROM listens l
JOIN songs s ON l.song_id = s.id
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
WHERE DATE_TRUNC('year', l.start_time) = DATE_TRUNC('year', CURRENT_DATE)
  AND NOT l.skipped
GROUP BY s.name, ar.name, al.name, s."image", s.sync_id
ORDER BY listens DESC
LIMIT 5;
