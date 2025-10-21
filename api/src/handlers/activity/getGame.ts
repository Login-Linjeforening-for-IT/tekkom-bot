import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default function getGameActivity(
    this: FastifyInstance,
    _request: FastifyRequest,
    reply: FastifyReply
) {
    reply.type('application/json').send(this.cachedGameJSON)
}
