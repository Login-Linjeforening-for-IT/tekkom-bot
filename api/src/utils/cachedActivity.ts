import { preloadActivityQueries } from '@/handlers/activity/activityQueries'
import fp from 'fastify-plugin'

export default fp(async (fastify) => {
    async function refreshQueries() {
        const newData = await preloadActivityQueries()
        fastify.cachedJSON = Buffer.from(JSON.stringify(newData))
        fastify.log.info('Activity queries refreshed')
    }

    refreshQueries()
    setInterval(refreshQueries, 5000)
})
