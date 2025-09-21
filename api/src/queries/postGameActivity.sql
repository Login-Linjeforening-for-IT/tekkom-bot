INSERT INTO game_activity (
    name, "user", user_id, avatar, details, state, application, "start", party
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
