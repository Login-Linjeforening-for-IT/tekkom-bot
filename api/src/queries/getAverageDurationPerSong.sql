SELECT ROUND(AVG(EXTRACT(EPOCH FROM ("end" - "start"))))::INT AS avg_seconds
FROM activites;