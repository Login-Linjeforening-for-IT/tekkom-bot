INSERT INTO users (id, avatar, "name")
VALUES ($1, $2, $3)
ON CONFLICT (id)
DO UPDATE SET
  avatar = EXCLUDED.avatar,
  "name" = EXCLUDED."name";
