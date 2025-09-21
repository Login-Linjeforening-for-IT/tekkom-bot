SELECT * FROM (
    SELECT DISTINCT ON (a.user_id)
        a.*,
        s."image",
        s.listens AS listens
    FROM activities a
    LEFT JOIN songs s
      ON a.song = s.name
      AND a.artist = s.artist
    WHERE a."start" <= NOW()
      AND a."end" >= NOW()
      AND NOT a.skipped
    ORDER BY a.user_id, a."start" DESC
) AS per_user
ORDER BY (NOW() - per_user."start") ASC;
