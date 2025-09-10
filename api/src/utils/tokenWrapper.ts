import { FastifyReply, FastifyRequest } from "fastify"
import config from '@constants'

const { USERINFO_URL } = config

const tokens = {
    'tekkom-bot': config.TEKKOM_BOT_API_TOKEN,
    'tekkom-bot-btg': config.TEKKOM_BOT_BTG_TOKEN,
    'queenbee-btg': config.QUEENBEE_BTG_TOKEN,
}

export default async function tokenWrapper(
    req: FastifyRequest,
    res: FastifyReply,
    custom: string[] = []
): Promise<{ valid: boolean, error?: string }> {
    const authHeader = req.headers['authorization']
    const btg = req.headers['btg']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            valid: false,
            error: 'Missing or invalid Authorization header'
        }
    }

    const token = authHeader.split(' ')[1]
    if (custom.includes('queenbee-btg') && btg === 'queenbee-btg' && token === tokens['queenbee-btg']) {
        return { valid: true }
    }

    if (custom.includes('tekkom-bot') && btg === 'tekkom-bot' && token === tokens['tekkom-bot']) {
        return { valid: true }
    }

    if (custom.includes('tekkom-bot-btg') && btg === 'tekkom-bot-btg' && token === tokens['tekkom-bot-btg']) {
        return { valid: true }
    }

    try {
        const userInfoRes = await fetch(USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!userInfoRes.ok) {
            return {
                valid: false,
                error: 'Unauthorized'
            }
        }

        // const userInfo = await userInfoRes.json()
        // console.log(userInfo)

        return {
            valid: true
        }
    } catch (err) {
        res.log.error(err)
        return res.status(500).send({
            valid: false,
            error: 'Internal server error'
        })
    }
}
