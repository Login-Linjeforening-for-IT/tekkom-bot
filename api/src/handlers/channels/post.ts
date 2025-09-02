import config, { channels } from "@constants"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

const customToken = config.TEKKOM_BOT_API_TOKEN

export default async function postChannels(req: FastifyRequest, res: FastifyReply) {
    const newChannels = req.body as Channel[] ?? []
    const { valid } = await tokenWrapper(req, res, customToken)

    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!newChannels.length) {
        return res.status(400).send({ message: 'Channels cannot be empty.' })
    }

    channels.length = 0
    channels.push(...newChannels)
    return res.send({ message: `Successfully set ${newChannels.length} channels.` })
}
