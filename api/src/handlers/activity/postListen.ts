import config from '#constants'
import run from "#db"
import getSpotifyToken from '#utils/getSpotifyToken.ts'
import { loadSQL } from '#utils/loadSQL.ts'
import tokenWrapper from "#utils/tokenWrapper.ts"
import type { FastifyReply, FastifyRequest } from "fastify"

export default async function postListen(req: FastifyRequest, res: FastifyReply) {
    const { user, song, artist, start, end, album, image, source, avatar, userId, skipped, syncId } = req.body as Activity ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!user || !song || !artist || !start || !end || !album || !image || !source || !avatar || !userId || !syncId) {
        console.log(`Missing those that are undefined:\n${JSON.stringify({ user, song, artist, start, end, album, image, source, avatar, userId, syncId })}`)
        return res.status(400).send({ error: "Please provide a valid listen activity." })
    }

    try {
        console.log(`Adding listen: song: '${song}', artist: '${artist}', user: '${user}'`)
        let artistId = 'Unknown'
        let albumId = 'Unknown'

        try {
            const token = await getSpotifyToken()
            const response = await fetch(`${config.SPOTIFY_API_TRACK_URL}/${syncId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!response.ok) {
                throw new Error(`Status: ${response.status} ${await response.text()}`)
            }

            const data = await response.json()
            if (data?.artists[0]?.id) {
                artistId = data?.artists[0]?.id
            }

            if (data?.album?.id) {
                albumId = data?.album?.id
            }
        } catch (error) {
            console.log(error)
        }

        if (skipped) {
            const previousQuery = await loadSQL('getPreviousSongForUser.sql')
            const previous = await run(previousQuery, [userId])

            if (previous && previous.rows.length > 0) {
                const activityId = previous.rows[0].id
                const activitySong = previous.rows[0].song
                const activitySongSyncId = previous.rows[0].syncId
                const activityArtist = previous.rows[0].artist
                const activityAlbum = previous.rows[0].album

                await run(`UPDATE listens SET skipped = $1 WHERE id = $2`, [true, activityId])
                await run(
                    `UPDATE songs
                    SET listens = GREATEST(listens - 1, 0),
                        skips = skips + 1,
                        sync_id = COALESCE($4, sync_id),
                        artist_id = COALESCE($5, artist_id),
                        album_id = COALESCE($6, album_id)
                    WHERE name = $1 AND artist = $2 AND album = $3`,
                    [activitySong, activityArtist, activityAlbum, activitySongSyncId, artistId, albumId]
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

        const userQuery = await loadSQL('postUser.sql')
        await run(userQuery, [userId, avatar, user])

        const postListenQuery = (await loadSQL('postListen.sql'))
        await run(
            postListenQuery,
            [user, song, artist, album, start, end, source, userId]
        )

        await run(
            `INSERT INTO songs AS s (name, artist, album, "image", sync_id, artist_id, album_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (name, artist, album)
            DO UPDATE SET 
            listens = s.listens + 1, 
            sync_id = EXCLUDED.sync_id, 
            artist_id = EXCLUDED.artist_id, 
            album_id = EXCLUDED.album_id, 
            timestamp = NOW();`,
            [song, artist, album, image, syncId, artistId, albumId]
        )

        await run(
            `INSERT INTO artists (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET listens = artists.listens + 1, timestamp = NOW()`,
            [artist]
        )

        return res.send({ message: `Successfully added song ${song} by ${artist}, played by ${user}` })
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
