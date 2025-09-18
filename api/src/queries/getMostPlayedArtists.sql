SELECT artist, COUNT(*) AS play_count
FROM activites
GROUP BY artist
ORDER BY play_count DESC
LIMIT 5;
