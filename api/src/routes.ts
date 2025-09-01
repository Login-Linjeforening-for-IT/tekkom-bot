import getAnnouncements from './handlers/announcements/get'
import postAnnouncements from './handlers/announcements/post'
import putAnnouncements from './handlers/announcements/put'
import deleteAnnouncements from './handlers/announcements/delete'
import getChannels from './handlers/channels/get'
import postChannels from './handlers/channels/post'
import getIndex from './handlers/index/getIndex'
import getToken from './handlers/login/getToken'
import getLogin from './handlers/login/getLogin'
import getCallback from './handlers/login/getCallback'
import postSentAnnouncements from './handlers/sent/post'
import { FastifyInstance, FastifyPluginOptions } from "fastify"

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get("/", getIndex)

    // channels
    fastify.get("/channels", getChannels)
    fastify.post("/channels", postChannels)

    // auth
    fastify.get('/token', getToken)
    fastify.get('/login', getLogin)
    fastify.get('/callback', getCallback)

    // announcements
    fastify.get('/announcements', getAnnouncements)
    fastify.put('/announcements', putAnnouncements)
    fastify.post('/announcements', postAnnouncements)
    fastify.delete('/announcements', deleteAnnouncements)
    fastify.post('/sent', postSentAnnouncements)
}
