import { FastifyReply, FastifyRequest } from "fastify"
import config from '@constants'

const { USERINFO_URL } = config

export default async function tokenWrapper(
    req: FastifyRequest,
    res: FastifyReply,
    customToken?: string
): Promise<{ valid: boolean, error?: string }> {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            valid: false,
            error: 'Missing or invalid Authorization header'
        }
    }

    const token = authHeader.split(' ')[1]

    if (token === customToken && customToken.length > 1000) {
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
