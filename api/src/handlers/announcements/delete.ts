import run from "#db"
import tokenWrapper from "#utils/tokenWrapper.ts"
import type { FastifyReply, FastifyRequest } from "fastify"

type DeleteAnnouncements = {
    id: number
}

export default async function deleteAnnouncements(req: FastifyRequest, res: FastifyReply) {
    const { id } = (req.body as DeleteAnnouncements) ?? {}
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!id) {
        return res.status(400).send({ error: 'No announcement specified.' })
    }

    try {
        const result = await run(`DELETE FROM announcements WHERE id = $1`, [id])
        return res.send(result.rows)
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
