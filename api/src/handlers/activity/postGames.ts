import run from "@db"
import { loadSQL } from '@utils/loadSQL'
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function postGame(req: FastifyRequest, res: FastifyReply) {
    const {
        name,
        user,
        user_id,
        avatar,
        details,
        state,
        application,
        start,
        party,
        image,
        imageText
    } = req.body as Game

    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!name || !user || !user_id || !avatar || !start) {
        return res.status(400).send({ error: "Please provide a valid game activity." })
    }

    try {
        console.log(`Adding game: name=${name}, user=${user}`)

        const gameQuery = await loadSQL('postGame.sql')
        await run(gameQuery, [name, image ?? null, imageText ?? null]);

        const gameActivityQuery = await loadSQL('postGameActivity.sql')
        await run(gameActivityQuery, [
            name,
            user,
            user_id,
            avatar,
            details ?? null,
            state ?? null,
            application ?? null,
            start,
            party ?? null
        ]);

        return res.send({ message: `Successfully added game ${name} for ${user}.` })
    } catch (error) {
        console.error(`Database error:`, error)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
