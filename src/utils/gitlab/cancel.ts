import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js"
import { Build } from "../../interfaces.js"

export default async function cancel(interaction: ButtonInteraction, build: Build) {
    let buttons: ActionRowBuilder<ButtonBuilder>

    // Creates 'trash' button
    const trash = new ButtonBuilder()
        .setCustomId('trash')
        .setLabel('🗑️')
        .setStyle(ButtonStyle.Secondary)

    buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(trash)

    const cancelEmbed = new EmbedBuilder()
        .setTitle(`Cancelled ${build}.`)
        .setDescription(`Manually cancelled by cancellation button.`)
        .setColor("#ff0000")

    const message = interaction.message
    interaction.update({ embeds: [message.embeds[0], cancelEmbed], components: [buttons] })
}
