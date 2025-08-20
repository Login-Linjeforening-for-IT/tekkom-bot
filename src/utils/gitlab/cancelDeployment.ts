import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js"

export default async function cancelDeployment(interaction: ButtonInteraction) {
    let buttons: ActionRowBuilder<ButtonBuilder>

    // Creates 'trash' button
    const trash = new ButtonBuilder()
        .setCustomId('trash')
        .setLabel('🗑️')
        .setStyle(ButtonStyle.Secondary)

    buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(trash)

    const cancelEmbed = new EmbedBuilder()
        .setTitle(`Cancelled deployment.`)
        .setDescription(`Manually cancelled by cancellation button.`)
        .setColor("#ff0000")

    const message = interaction.message
    interaction.update({ embeds: [message.embeds[0], cancelEmbed], components: [buttons] })
}
