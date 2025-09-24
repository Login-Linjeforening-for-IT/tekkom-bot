import run from "@db"
import discordAlert from '@utils/discordAlert'
import tokenWrapper from "@utils/tokenWrapper"
import { FastifyReply, FastifyRequest } from "fastify"

export default async function postBtg(req: FastifyRequest, res: FastifyReply) {
    const { name, service, author } = req.body as Btg ?? {}
    const { valid } = await tokenWrapper(req, res, ['tekkom-bot-btg'])
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!name || !service || !author) {
        return res.status(400).send({ error: "Name, service and author must be provided." })
    }

    try {
        console.log(`Adding btg: name=${name}, service=${service}, author=${author}`)
        await discordAlert(`BTG ping exception for user ${name}, service ${service} was added to the TekKom Bot API by <@${author}>. Please verify that there are currently known issues with Authentik and that this is expected.`, 'post')

        await run(
            `INSERT INTO btg (name, service, author) 
             SELECT $1, $2, $3;`, 
            [name, service, author]
        )

        return res.send({ message: `Successfully added btg account ${name} for service ${service} by ${author}.` })
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
