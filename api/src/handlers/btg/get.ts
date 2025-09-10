import run from "@/db"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function getBtg(req: FastifyRequest, res: FastifyReply) {
    const { name, service, author } =  (req.query as Btg) ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot-btg'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (name && service) {
        const result = await run(
            `SELECT name, service, author FROM btg WHERE name = $1 AND service = $2 AND author = $3;`, 
            [name, service, author]
        )
        return res.send(result.rows)
    }

    return res.status(400).send({ error: "Invalid" })
}
