SELECT
    -- Average song duration in seconds
    ROUND(AVG(EXTRACT(EPOCH FROM ("end" - "start"))))::INT AS avg_seconds,

    -- Total duration in minutes
    ROUND(SUM(EXTRACT(EPOCH FROM ("end" - "start"))) / 60)::INT AS total_minutes,

    -- Total duration in minutes this year
    ROUND(
        SUM(
            CASE WHEN DATE_PART('year', "start") = DATE_PART('year', CURRENT_DATE)
                 THEN EXTRACT(EPOCH FROM ("end" - "start"))
                 ELSE 0
            END
        ) / 60
    )::INT AS total_minutes_this_year,

    -- Total number of songs played
    COUNT(*) AS total_songs
FROM activites;
