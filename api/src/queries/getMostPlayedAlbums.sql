SELECT album, artist, COUNT(*) AS play_count
FROM activites
GROUP BY album, artist
ORDER BY play_count DESC
LIMIT 5;
