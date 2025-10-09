import config from '#constants'
import run from "#db"
import getSpotifyToken from '#utils/getSpotifyToken.ts'
import { loadSQL } from '#utils/loadSQL.ts'
import tokenWrapper from "#utils/tokenWrapper.ts"
import type { FastifyReply, FastifyRequest } from "fastify"

export default async function postListen(req: FastifyRequest, res: FastifyReply) {
    const { id, user, song, artist, start, end, album, image, source, avatar, userId, skipped } = req.body as Activity ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!user || !song || !artist || !start || !end || !album || !image || !source || !avatar || !userId) {
        console.log(`Missing those that are undefined:\n${JSON.stringify({ id, user, song, artist, start, end, album, image, source, avatar, userId })}`)
        return res.status(400).send({ error: "Please provide a valid listen activity." })
    }

    try {
        console.log(`Adding song: '${song}' by artist '${artist}' for user '${user}'.`)
        let artistId = 'Unknown'
        let albumId = 'Unknown'

        try {
            const token = await getSpotifyToken()
            const response = await fetch(`${config.SPOTIFY_API_TRACK_URL}/${id}`, {
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
                await run(`UPDATE listens SET skipped = $1 WHERE song_id = $2`, [true, activityId])
                const artistQuery = await loadSQL('postArtist.sql')
                await run(artistQuery, [artistId || 'Unknown', artist])
                const albumQuery = await loadSQL('postAlbum.sql')
                await run(albumQuery, [albumId || 'Unknown', album])
                const songQuery = await loadSQL('postSongSkip.sql')
                await run(songQuery, [activitySong, activityArtist, activityAlbum, activitySongSyncId, artistId, albumId])
            }
        }

        const userQuery = await loadSQL('postUser.sql')
        await run(userQuery, [userId, avatar, user])
        const artistQuery = await loadSQL('postArtist.sql')
        await run(artistQuery, [artistId || 'Unknown', artist])
        const albumQuery = await loadSQL('postAlbum.sql')
        await run(albumQuery, [albumId || 'Unknown', album])
        const songQuery = await loadSQL('postSongListen.sql')
        const songResult = await run(songQuery, [id, song, artistId, albumId, image])
        const songId = songResult.rows[0].id
        const listenQuery = await loadSQL('postListen.sql')
        await run(listenQuery, [userId, songId, start, end, source, skipped ?? false])
        return res.send({ message: `Successfully added song ${song} by ${artist}, played by ${user}` })
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
