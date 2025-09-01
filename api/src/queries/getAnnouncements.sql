SELECT * FROM announcements
ORDER BY id DESC
LIMIT $2::INT OFFSET ($1::INT * $2::INT) - $2::INT;
