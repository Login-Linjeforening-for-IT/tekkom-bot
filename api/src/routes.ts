import announcementsGetHandler from './handlers/announcements/get'
import announcementsPostHandler from './handlers/announcements/post'
import getChannelsHandler from './handlers/channels/get'
import postChannelsHandler from './handlers/channels/post'
import getIndex from './handlers/index/getIndex'

import { FastifyInstance, FastifyPluginOptions } from "fastify"

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get("/", getIndex)

    // channels
    fastify.get("/channels", getChannelsHandler)
    fastify.post("/channels", postChannelsHandler)

    // announcements
    fastify.get('/announcements', announcementsGetHandler)
    fastify.post('/announcements', announcementsPostHandler)
    fastify.patch('/announcements', announcementsPostHandler)
    fastify.delete('/announcements', announcementsPostHandler)
}
