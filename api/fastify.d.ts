
import "fastify"
import type { preloadActivityQueries } from "./handlers/activity/activityQueries"

declare module "fastify" {
    interface FastifyInstance {
        cachedJSON: Buffer
    }
}
