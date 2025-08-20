import { Increment } from "../../interfaces.js"
import { UNKNOWN_VERSION } from "../../constants.js"
import { errorButtons } from '../../utils/gitlab/buttons.js'
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder
} from "discord.js"

type ContinueDeploymentProps = {
    interaction: ChatInputCommandInteraction | ButtonInteraction
    embed?: EmbedBuilder
    latestVersion: string
}

export default async function continueDeployment({ interaction, embed, latestVersion }: ContinueDeploymentProps) {
    let buttons: ActionRowBuilder<ButtonBuilder>

    if (increment(latestVersion, Increment.MAJOR) !== UNKNOWN_VERSION) {
        // Creates 'major' button
        const major = new ButtonBuilder()
            .setCustomId('major')
            .setLabel(`Major (${increment(latestVersion, Increment.MAJOR)})`)
            .setStyle(ButtonStyle.Primary)

        // Creates 'minor' button
        const minor = new ButtonBuilder()
            .setCustomId('minor')
            .setLabel(`Minor (${increment(latestVersion, Increment.MINOR)})`)
            .setStyle(ButtonStyle.Primary)

        // Creates 'patch' button
        const patch = new ButtonBuilder()
            .setCustomId('patch')
            .setLabel(`Patch (${increment(latestVersion, Increment.PATCH)})`)
            .setStyle(ButtonStyle.Primary)

        // Creates 'trash' button
        const trash = new ButtonBuilder()
            .setCustomId('trash')
            .setLabel('🗑️')
            .setStyle(ButtonStyle.Secondary)

        buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(major, minor, patch, trash)
    } else {
        buttons = errorButtons
    }

    // ChatInputCommandInteraction
    if (embed) {
        await interaction.reply({ embeds: [embed], components: [buttons] })
        // ButtonInteraction
    } else if (interaction.isButton()) {
        const message = interaction.message
        await interaction.reply({ embeds: message.embeds, components: [buttons] })
    }
}

function increment(version: string, type: Increment) {
    version = version === "No version released." ? "1.0.0" : version
    let versionParts = version.split('.').map(Number)

    if (isNaN(versionParts[2])) {
        versionParts[2] = Number(version.split('.')[2].split('-')[0]) ?? NaN
    }

    if (versionParts.length !== 3 || versionParts.some(isNaN)) {
        return UNKNOWN_VERSION
    }

    let [major, minor, patch] = versionParts

    switch (type) {
        case Increment.MAJOR:
            major += 1
            minor = 0
            patch = 0
            break
        case Increment.MINOR:
            minor += 1
            patch = 0
            break
        case Increment.PATCH:
            patch += 1
            break
        default:
            return UNKNOWN_VERSION
    }

    return `${major}.${minor}.${patch}`
}
