SELECT * FROM (
    SELECT DISTINCT ON (a.user_id)
        a.*,
        s."image",
        s.sync_id
    FROM activities a
    LEFT JOIN songs s
      ON a.song_id = s.id
    WHERE a.start_time <= NOW()
      AND a.end_time >= NOW()
      AND NOT a.skipped
    ORDER BY a.user_id, a.start_time DESC
) AS per_user
ORDER BY (NOW() - per_user.start_time) ASC;
