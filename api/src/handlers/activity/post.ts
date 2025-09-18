import run from "@db"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function postActivity(req: FastifyRequest, res: FastifyReply) {
    const { user, song, artist, start, end, album, image, source } = req.body as Activity ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!user || !song || !artist || !start || !end || !album || !image || !source ) {
        return res.status(400).send({ error: "Please provide a valid activity." })
    }

    try {
        console.log(`Adding activity: song=${song}, artist=${artist}, user=${user}`)

        await run(
            `INSERT INTO activites ("user", song, artist, album, "start", "end", source)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
            [user, song, artist, album, start, end, source]
        )

        await run(
            `INSERT INTO songs (name, artist, album, "image")
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (name, artist, album)
             DO UPDATE SET listens = songs.listens + 1, timestamp = NOW()`,
            [song, artist, album, image]
        )

        await run(
            `INSERT INTO artists (name)
             VALUES ($1)
             ON CONFLICT (name)
             DO UPDATE SET listens = artists.listens + 1, timestamp = NOW()`,
            [artist]
        )

        return res.send({ message: `Successfully added song ${song} by ${artist}, played by ${user}`})
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
