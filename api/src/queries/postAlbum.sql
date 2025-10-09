INSERT INTO albums (id, name)
VALUES ($1, $2)
ON CONFLICT (id) DO UPDATE
SET 
    id = CASE 
           WHEN albums.id = 'Unknown' AND EXCLUDED.id IS NOT NULL AND EXCLUDED.id <> 'Unknown' 
           THEN EXCLUDED.id
           ELSE albums.id
         END;
