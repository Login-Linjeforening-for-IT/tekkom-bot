import { roles } from "#constants"
import tokenWrapper from "#utils/tokenWrapper.ts"
import type { FastifyReply, FastifyRequest } from "fastify"

export default async function getRoles(req: FastifyRequest, res: FastifyReply) {
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    return res.send(roles)
}
