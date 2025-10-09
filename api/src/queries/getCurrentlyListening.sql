SELECT * FROM (
    SELECT DISTINCT ON (l.user_id)
        l.*,
        s."image",
        s.sync_id
    FROM listens l
    LEFT JOIN songs s
      ON l.song_id = s.id
    WHERE l.start_time <= NOW()
      AND l.end_time >= NOW()
      AND NOT l.skipped
    ORDER BY l.user_id, l.start_time DESC
) AS per_user
ORDER BY (NOW() - per_user.start_time) ASC;
