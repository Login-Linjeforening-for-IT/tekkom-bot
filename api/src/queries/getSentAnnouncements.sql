SELECT * FROM announcements
WHERE interval IS NOT NULL AND (sent = true AND (time IS NULL OR time <= NOW()))
ORDER BY id DESC;
