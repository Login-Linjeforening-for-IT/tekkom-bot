
import "fastify"

declare module "fastify" {
    interface FastifyInstance {
        cachedJSON: Buffer
    }
}
