import cors from '@fastify/cors'
import Fastify from 'fastify'
import apiRoutes from './routes.ts'
import getIndex from './handlers/index/getIndex.ts'
import cron from './utils/cron/cron.ts'
import fp from './utils/fp.ts'

const fastify = Fastify({
    logger: true
})

fastify.decorate('cachedListenJSON', Buffer.from(''))
fastify.decorate('cachedGameJSON', Buffer.from(''))
fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
})

const port = Number(process.env.PORT) || 8080

fastify.register(fp)
fastify.register(apiRoutes, { prefix: "/api" })
fastify.get('/', getIndex)

async function start() {
    try {
        await fastify.listen({ port, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

async function main() {
    cron()
    start()
}

main()
