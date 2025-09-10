import { FastifyReply, FastifyRequest } from "fastify"
import tokenWrapper from "@utils/tokenWrapper.js"
import checkAndAlert from '@utils/checkAndAlert'

export default async function getToken(req: FastifyRequest, res: FastifyReply) {
    const response = await tokenWrapper(req, res, ['tekkom-bot', 'queenbee-btg'])
    if (!response.valid) {
        return res.status(400).send(response)
    }

    await checkAndAlert(req.headers['name'] as string, 'queenbee')

    return res.status(200).send(response)
}
