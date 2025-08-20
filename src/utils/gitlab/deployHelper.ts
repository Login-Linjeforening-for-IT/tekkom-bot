import { ButtonInteraction, CacheType } from "discord.js"
import continueDeployment from "./continueDeployment.js"

export default async function deployHelper(interaction: ButtonInteraction<CacheType>) {
    const message = interaction.message
    const latestVersion = message.embeds[0].fields[3].value
    await continueDeployment({ interaction: message, latestVersion })
}
