INSERT INTO games (name, image, image_text)
VALUES ($1, $2, $3)
ON CONFLICT (name) 
DO UPDATE SET
    players = games.players + 1,
    image = EXCLUDED.image,
    image_text = EXCLUDED.image_text;
