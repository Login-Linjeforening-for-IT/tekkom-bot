import run from "@db"
import { loadSQL } from '@utils/loadSQL'
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function postActivity(req: FastifyRequest, res: FastifyReply) {
    const { user, song, artist, start, end, album, image, source, avatar, userId, skipped, syncId } = req.body as Activity ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!user || !song || !artist || !start || !end || !album || !image || !source || !avatar || !userId || !syncId) {
        return res.status(400).send({ error: "Please provide a valid activity." })
    }

    try {
        console.log(`Adding activity: song=${song}, artist=${artist}, user=${user}`)

        if (skipped) {
            const previous = await run(
                `SELECT id, song, artist, album FROM activities WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1`,
                [userId]
            )

            if (previous && previous.rows.length > 0) {
                const activityId = previous.rows[0].id
                const activitySong = previous.rows[0].song
                const activitySongSyncId = previous.rows[0].syncId
                const activityArtist = previous.rows[0].artist
                const activityAlbum = previous.rows[0].album

                await run(`UPDATE activities SET skipped = $1 WHERE id = $2`, [true, activityId])
                await run(
                    `UPDATE songs
                    SET listens = GREATEST(listens - 1, 0),
                        skips = skips + 1,
                        sync_id = $4
                    WHERE name = $1 AND artist = $2 AND album = $3`,
                    [activitySong, activityArtist, activityAlbum, activitySongSyncId]
                )

                await run(
                    `UPDATE artists
                    SET listens = GREATEST(listens - 1, 0),
                        skips = skips + 1
                    WHERE name = $1`,
                    [activityArtist]
                )
            }
        }

        const postActivityQuery = (await loadSQL('postActivity.sql'))
        await run(
            postActivityQuery, 
            [user, song, artist, album, start, end, source, avatar, userId]
        )

        await run(
            `INSERT INTO songs AS s (name, artist, album, "image", sync_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (name, artist, album)
            DO UPDATE SET listens = s.listens + 1, sync_id = EXCLUDED.sync_id, timestamp = NOW();`,
            [song, artist, album, image, syncId]
        )

        await run(
            `INSERT INTO artists (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET listens = artists.listens + 1, timestamp = NOW()`,
            [artist]
        )

        return res.send({ message: `Successfully added song ${song} by ${artist}, played by ${user}`})
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
