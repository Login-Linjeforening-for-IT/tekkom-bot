import { ButtonInteraction, EmbedBuilder } from "discord.js"
import continueRelease from "#utils/gitlab/continueRelease.ts"
import { EDIT_INTERVAL_SECONDS } from "#constants"

export default async function releaseHelper(interaction: ButtonInteraction) {
    const message = interaction.message
    const embed = EmbedBuilder.from(message.embeds[0])
    const title = message.embeds[0].title || ''
    const id = Number(message.embeds[0].fields[0].value)
    const tagArray = title.match(/\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?/) || ['0.0.0']
    const tag = tagArray[0]
    const match = title.match(/for (.*?)\./)
    const repository = match ? match[1] : ""
    await continueRelease({ message: interaction, embed, id, tag, repository, interval: EDIT_INTERVAL_SECONDS })
}
