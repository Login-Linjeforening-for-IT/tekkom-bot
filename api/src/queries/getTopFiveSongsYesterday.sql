SELECT 
    s.name AS song, 
    ar.name AS artist, 
    al.name AS album, 
    s."image",
    s.sync_id,
    COUNT(*)::INT AS listens
FROM activities a
JOIN songs s ON a.song_id = s.id
JOIN artists ar ON s.artist_id = ar.id
JOIN albums al ON s.album_id = al.id
WHERE a.start_time::date = CURRENT_DATE - INTERVAL '1 day'
  AND NOT a.skipped
GROUP BY s.name, ar.name, al.name, s."image", s.sync_id
ORDER BY listens DESC
LIMIT 5;
