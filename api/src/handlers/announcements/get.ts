import run from "@/db"
import { loadSQL } from "@utils/loadSQL"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

type GetAnnouncements = {
    id?: number
    page: number
    announcementsPerPage: number
    active?: boolean
    shouldBeSent?: true
}

export default async function announcementsGetHandler(req: FastifyRequest, res: FastifyReply) {
    const { id, page, announcementsPerPage, active, shouldBeSent } =  (req.body as GetAnnouncements) ?? {}
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (id) {
        const result = await run(`SELECT * FROM announcements WHERE id = $1;`, [id])
        return res.send(result.rows)
    }

    const query = (await loadSQL('getAnnouncements.sql'))
    const result = await run(query, [page, announcementsPerPage, active || null, shouldBeSent || null])
    res.send(result.rows)
}
