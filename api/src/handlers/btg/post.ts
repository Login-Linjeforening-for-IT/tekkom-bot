import config from "@constants"
import run from "@db"
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

const customToken = config.TEKKOM_BOT_BTG_TOKEN

export default async function postBtg(req: FastifyRequest, res: FastifyReply) {
    const { name, service, author } = req.body as Btg ?? {}
    const { valid } = await tokenWrapper(req, res, customToken)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!name || !service || !author) {
        return res.status(400).send({ error: "Name, service and author must be provided." })
    }

    try {
        console.log(`Adding btg: name=${name}, service=${service}, author=${author}`)

        await run(
            `INSERT INTO btg (name, service, author) 
             SELECT $1, $2, $3;`, 
            [name, service, author]
        )

        return res.send({ message: `Successfully added btg account ${name} for service ${service} by ${author}.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
