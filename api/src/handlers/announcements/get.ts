import run from "@/db"
import alertSlowQuery from '@utils/alertSlowQuery'
import { loadSQL } from "@utils/loadSQL"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

type GetAnnouncements = {
    id?: string
    page: string
    announcementsPerPage: string
    active?: string
    shouldBeSent?: string
}

export default async function getAnnouncements(req: FastifyRequest, res: FastifyReply) {
    const { id, page, announcementsPerPage, active, shouldBeSent } =  (req.query as GetAnnouncements) ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (id) {
        const result = await run(`SELECT * FROM announcements WHERE id = $1;`, [id])
        return res.send(result.rows)
    }

    const query = (await loadSQL('getAnnouncements.sql'))
    const pageInt = parseInt(page || "1", 10)
    const perPageInt = parseInt(announcementsPerPage || "10", 10)
    const activeBool = active === "true"
    const shouldBeSentBool = shouldBeSent === "true"
    const start = Date.now()
    const result = await run(query, [pageInt, perPageInt, activeBool, shouldBeSentBool])
    const duration = (Date.now() - start) / 1000
    alertSlowQuery(duration, 'announcements')
    res.send(result.rows)
}
