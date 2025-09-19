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
import getRoles from './handlers/roles/get'
import postRoles from './handlers/roles/post'
import getBtg from './handlers/btg/get'
import postBtg from './handlers/btg/post'
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import postActivity from './handlers/activity/post'
import getActivity from './handlers/activity/get'
import postHideActivity from './handlers/activity/postHide'

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get("/", getIndex)

    // channels
    fastify.get("/channels", getChannels)
    fastify.post("/channels", postChannels)

    // roles
    fastify.get("/roles", getRoles)
    fastify.post("/roles", postRoles)

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

    // btg
    fastify.get("/btg", getBtg)
    fastify.post("/btg", postBtg)

    // activity
    fastify.get("/activity", getActivity)
    fastify.post("/activity", postActivity)
    fastify.post("/activity/hide", postHideActivity)
}
