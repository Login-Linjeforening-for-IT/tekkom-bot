SELECT 
    a.*,
    s."image",
    s.listens AS play_count
FROM activites a
LEFT JOIN songs s
  ON a.song = s.name
  AND a.artist = s.artist
WHERE a."start" <= NOW()
  AND a."end" >= NOW()
ORDER BY a."start" DESC;
