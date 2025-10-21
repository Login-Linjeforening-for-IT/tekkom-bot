WITH recent AS (
  SELECT game_id, user_id
  FROM game_activity
  WHERE game_id = $1
    AND user_id = $2
    AND "end" > now() - interval '5 minutes'
),
updated AS (
  UPDATE game_activity
  SET "end" = now()
  WHERE (game_id, user_id) IN (SELECT game_id, user_id FROM recent)
  RETURNING *
)
INSERT INTO game_activity (
    game_id,
    user_id,
    details,
    state,
    application,
    "start",
    "end",
    party
)
SELECT $1, $2, $3, $4, $5, $6, now(), $7
WHERE NOT EXISTS (SELECT 1 FROM recent)
RETURNING *;
