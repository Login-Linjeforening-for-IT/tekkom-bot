SELECT * FROM announcements
WHERE (COALESCE($3::BOOLEAN, false) = false OR interval IS NOT NULL OR sent = false)
  AND (COALESCE($4::BOOLEAN, false) = false OR (sent = false AND (time IS NULL OR time <= NOW())))
ORDER BY id DESC
LIMIT $2::INT
OFFSET (($1::INT * $2::INT) - $2::INT);
