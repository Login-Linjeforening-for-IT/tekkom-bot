import config from '#constants'
import run from '#db'
import artistIdAndAlbumIdIsKnownBySongId from '#utils/artistIdAndAlbumIdIsKnownBySongId.ts'
import getSpotifyToken from '#utils/getSpotifyToken.ts'
import { loadSQL } from '#utils/loadSQL.ts'
import tokenWrapper from '#utils/tokenWrapper.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'

export default async function postListen(
    req: FastifyRequest,
    res: FastifyReply
) {
    const {
        id,
        user,
        name,
        artist,
        start,
        end,
        album,
        image,
        source,
        avatar,
        userId,
        skipped,
    } = (req.body as Activity) ?? {}

    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: 'Unauthorized' })
    }

    if (
        !user ||
    !name ||
    !artist || // does not find artist
    !start ||
    !end ||
    !album ||
    !image ||
    !source ||
    !avatar ||
    !userId
    ) {
        console.log(
            `Missing those that are undefined:\n${JSON.stringify({
                id,
                user,
                name,
                artist,
                start,
                end,
                album,
                image,
                source,
                avatar,
                userId,
            })}`
        )
        return res
            .status(400)
            .send({ error: 'Please provide a valid listen activity.' })
    }

    try {
        console.log(
            `Adding song: '${name}' by artist '${artist}' for user '${user}'.`
        )

        let artistId: string = 'Unknown'
        let albumId: string = 'Unknown'
        let type = 'Unknown'

        // :TODO: Refactor with two separate tables, for episodes and tracks.

        const artistIdAndAlbumIdIsNotKnown = !(await artistIdAndAlbumIdIsKnownBySongId(id))
        const shouldQuerySpotify = artistIdAndAlbumIdIsNotKnown || Math.random() < 0.1

        if (shouldQuerySpotify) {
            try {
                const token = await getSpotifyToken()

                // First, try to fetch as a track
                let response = await fetch(`${config.SPOTIFY_API_TRACK_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data?.artists?.[0]?.id) {
                        artistId = data.artists[0].id
                    }
                    if (data?.album?.id) {
                        albumId = data.album.id
                    }
                    type = 'track'
                } else {
                    // If that fails, try to fetch as an episode
                    response = await fetch(`${config.SPOTIFY_API_EPISODE_URL}/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })

                    // If that fails, not found on Spotify
                    if (!response.ok) {
                        throw new Error(
                            `Spotify Error, Status: ${response.status} ${await response.text()}`
                        )
                    }
                    const data = await response.json()
                    if (data.show?.publisher) {
                        artistId = data.show.publisher
                    }
                    if (data.show?.id) {
                        albumId = data.show.id
                    }
                    type = 'episode'
                }

            } catch (error) {
                console.log('Spotify lookup failed:', error)
                // Continue without failing the whole request; fallback IDs remain "Unknown"
            }
        }

        if (skipped) {
            const previousQuery = await loadSQL('getPreviousSongForUser.sql')
            const previous = await run(previousQuery, [userId])

            if (previous && previous.rows.length > 0) {
                const listenId = previous.rows[0].id
                const prevSongId = previous.rows[0].song_id
                await run('UPDATE listens SET skipped = $1 WHERE id = $2', [true, listenId])
                await run('UPDATE songs SET skips = COALESCE(skips, 0) + 1 WHERE id = $1', [prevSongId])
            }
        }

        const userQuery = await loadSQL('postUser.sql')
        await run(userQuery, [userId, avatar, user])

        const artistQuery = await loadSQL('postArtist.sql')
        await run(artistQuery, [artistId || 'Unknown', artist])

        const albumQuery = await loadSQL('postAlbum.sql')
        await run(albumQuery, [albumId || 'Unknown', album])

        const songQuery = await loadSQL('postSongListen.sql')
        const songResult = await run(songQuery, [id, name, artistId, albumId, image, type])
        const insertedSongId = songResult.rows[0].id

        const listenQuery = await loadSQL('postListen.sql')
        await run(listenQuery, [userId, insertedSongId, start, end, source, skipped ?? false])

        return res.send({
            message: `Successfully added song ${name} by ${artist}, played by ${user}`,
        })
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}