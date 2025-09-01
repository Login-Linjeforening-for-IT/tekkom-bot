SELECT * FROM announcements
WHERE ($3::BOOLEAN IS NULL OR interval IS NOT NULL)
  AND ($4::BOOLEAN IS NULL OR sent = false)
ORDER BY id DESC
LIMIT $2::INT
OFFSET (($1::INT * $2::INT) - $2::INT);
