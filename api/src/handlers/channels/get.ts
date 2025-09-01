import { channels } from "@constants"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function getChannels(req: FastifyRequest, res: FastifyReply) {
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    return res.send(channels)
}
