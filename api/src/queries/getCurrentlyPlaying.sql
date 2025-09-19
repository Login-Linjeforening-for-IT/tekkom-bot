SELECT 
    a.*,
    s."image",
    s.listens AS listens
FROM activities a
LEFT JOIN songs s
  ON a.song = s.name
  AND a.artist = s.artist
WHERE a."start" <= NOW()
  AND a."end" >= NOW()
ORDER BY a."start" DESC;
