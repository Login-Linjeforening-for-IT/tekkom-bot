SELECT * FROM (
    SELECT DISTINCT ON (l.user_id)
        l.*,
        s."image"
    FROM listens l
    LEFT JOIN songs s
      ON l.song_id = s.id
    WHERE l."start" <= NOW()
      AND l."end" >= NOW()
      AND NOT l.skipped
    ORDER BY l.user_id, l."start" DESC
) AS per_user
ORDER BY (NOW() - per_user."start") ASC;
