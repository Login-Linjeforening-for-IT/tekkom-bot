import config from '@constants'
import getSpotifyToken from '@utils/getSpotifyToken'
import tokenWrapper from '@utils/tokenWrapper'
import { FastifyReply, FastifyRequest } from 'fastify'

export default async function getTrackPreview(req: FastifyRequest, res: FastifyReply) {
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    try {
        const { id } = req.params as { id: string } ?? {}
        const token = await getSpotifyToken()
        const response = await fetch(`${config.SPOTIFY_API_TRACK_URL}/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const data = await response.json()
        console.log(data)
        res.send({ data })
    } catch (error) {
        console.log(error)
        return { url: null, error }
    }
}
