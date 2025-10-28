import type { ButtonInteraction, CacheType } from 'discord.js'
import continueDeployment from '#utils/gitlab/continueDeployment.ts'

export default async function deployHelper(interaction: ButtonInteraction<CacheType>) {
    const message = interaction.message
    const latestVersion = message.embeds[0].fields[3].value
    await continueDeployment({ interaction, latestVersion })
}
