import run from '#db'
import discordIssue from '#utils/discordIssue.ts'
import getIssueName from '#utils/getIssueName.ts'
import type { FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'crypto'
import config from '#constants'

type GitHubProjectsV2ItemPayload = {
  action: string
  projects_v2_item: any
  changes?: {
    field_value?: any
  }
  sender: {
    login: string
  }
}

export default async function postIssue(req: FastifyRequest, res: FastifyReply) {
    const signature = req.headers['x-hub-signature-256'] as string
    if (!signature) {
        return res.status(401).send({ error: 'Missing signature' })
    }

    const payload = JSON.stringify(req.body)
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', config.GITHUB_WEBHOOK_SECRET as string).update(payload).digest('hex')
    if (signature !== expectedSignature) {
        return res.status(401).send({ error: 'Invalid signature' })
    }

    const eventType = req.headers['x-github-event']
    if (eventType === 'ping') {
        return res.status(200).send({ msg: 'pong' })
    }
    else if (eventType === 'push') {
        return res.status(202).send({ msg: 'Ignoring push events' })
    }
    else if (eventType !== 'projects_v2_item') {
        return res.status(400).send({ error: 'Invalid event type' })
    }

    const body = req.body as GitHubProjectsV2ItemPayload
    const { action, projects_v2_item, changes, sender } = body

    try {
        const issueTitle = await getIssueName({ issueID: projects_v2_item.id })

        if (action === 'created') {
            await discordIssue(
                'Created',
                `Issue '${issueTitle}' was created`,
                `Action by ${sender.login}`,
                'green'
            )
        } else if (action === 'edited' && changes?.field_value.to && changes.field_value.from) {
            await discordIssue(
                'Moved',
                `Issue '${issueTitle}' was moved to '${changes.field_value.to.name}' from '${changes.field_value.from.name}'`,
                `Action by ${sender.login}`,
                changes.field_value.to.color
            )
        }

        return res.status(200).send({ ok: true })
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}
