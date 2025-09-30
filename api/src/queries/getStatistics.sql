SELECT
    ROUND(AVG(EXTRACT(EPOCH FROM (end_time - start_time))))::INT AS avg_seconds,
    ROUND(SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 60.0))::INT AS total_minutes,
    ROUND(
        SUM(
            CASE WHEN DATE_PART('year', start_time) = DATE_PART('year', CURRENT_DATE)
                 THEN EXTRACT(EPOCH FROM (end_time - start_time)) / 60.0
                 ELSE 0
            END
        )
    )::INT AS total_minutes_this_year,
    COUNT(*)::INT AS total_songs
FROM activities
WHERE NOT skipped;
