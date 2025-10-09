import { preloadActivityQueries } from '#utils/activityQueries.ts'
import config from '#constants'
import fp from 'fastify-plugin'
import alertSlowQuery from '#utils/alertSlowQuery.ts'

export default fp(async (fastify) => {
    async function refreshQueries() {
        const start = Date.now()
        const newData = await preloadActivityQueries()
        const duration = (Date.now() - start) / 1000
        alertSlowQuery(duration, 'cache')
        fastify.cachedJSON = Buffer.from(JSON.stringify(newData))
        fastify.log.info('Activity queries refreshed')
    }

    refreshQueries()
    setInterval(refreshQueries, config.CACHE_TTL)
})
