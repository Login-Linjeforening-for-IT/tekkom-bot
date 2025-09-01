import { channels } from "@constants"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

type Channel = { 
    name: string
    value: string
}

export default async function postChannelsHandler(req: FastifyRequest, res: FastifyReply) {
    const { channels: newChannels } = req.body as { channels: Channel[] }
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!newChannels.length) {
        return res.status(400).send({message: 'Channels cannot be empty.'})
    }

    channels.length = 0
    channels.push(...newChannels)
    return res.send({message: `Successfully set ${newChannels.length} channels.`})
}
