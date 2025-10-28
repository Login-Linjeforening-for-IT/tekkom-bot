import { ButtonInteraction } from 'discord.js'
import deploy from '#utils/gitlab/deploy.ts'
import getPipelines, { getJobsForPipeline } from '#utils/gitlab/pipeline.ts'
import formatVersion from '#utils/gitlab/formatVersion.ts'
import retryJob from '#utils/gitlab/retryJob.ts'

export default async function retryDeployment(interaction: ButtonInteraction) {
    const message = interaction.message
    const name = message.embeds[0].title || 'unknown'
    const id = Number(message.embeds[0].fields[0].value)
    const tag = formatVersion(message.embeds[1].title || '').join('.') || 'unknown'
    const isDev = message.embeds[1].title?.includes('-dev')

    deploy(interaction, tag, name, id, isDev ? '-dev' : '', isDev ? 'dev' : undefined, true)
    resumeStoppedPipelines(id)
    interaction.deferUpdate()
}

export async function resumeStoppedPipelines(id: number) {
    const pipelines = await getPipelines(id)
    const jobs = await getJobsForPipeline(id, pipelines[0].id)

    for (const job of jobs) {
        if (job.status === 'failed') {
            retryJob(id, job.id)
        }
    }
}
