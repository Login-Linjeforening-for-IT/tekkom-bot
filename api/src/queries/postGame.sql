INSERT INTO games (name, image, image_text)
VALUES ($1, $2, $3)
ON CONFLICT (name) DO UPDATE SET
    image = EXCLUDED.image,
    image_text = EXCLUDED.image_text
RETURNING id;

INSERT INTO game_activity (
    game_id,
    user_id,
    details,
    state,
    application,
    start_time,
    party
)
VALUES (
    (SELECT id FROM games WHERE name = $1),
    $3,
    $5,
    $6,
    $7,
    $8,
    $9
);
