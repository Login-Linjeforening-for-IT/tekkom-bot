INSERT INTO game_activity (
    game_id,
    user_id,
    details,
    state,
    application,
    start_time,
    party
)
VALUES ($1, $2, $3, $4, $5, $6, $7);
