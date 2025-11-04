INSERT INTO songs (id, "name", artist, album, "image", type)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (id)
DO UPDATE 
SET 
    listens = songs.listens + 1,
    "image" = EXCLUDED."image",
    artist = CASE 
               WHEN EXCLUDED.artist IS NOT NULL 
                    AND EXCLUDED.artist <> 'Unknown' 
               THEN EXCLUDED.artist 
               ELSE songs.artist 
             END,
    album = CASE 
              WHEN EXCLUDED.album IS NOT NULL 
                   AND EXCLUDED.album <> 'Unknown' 
              THEN EXCLUDED.album 
              ELSE songs.album 
            END
RETURNING id;
