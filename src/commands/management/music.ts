import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags, EmbedBuilder } from 'discord.js'
import postHide from '../../utils/activity/postHide.ts'

export const data = new SlashCommandBuilder()
    .setName('music')
    .setDescription('Hide yourself from music activity on login.no')
export async function execute(message: ChatInputCommandInteraction) {
    await whitelist(message)
}

async function whitelist(message: ChatInputCommandInteraction) {
    const user = message.user.tag
    const verdict = await postHide(user)
    if (!('action' in verdict)) {
        return await message.reply({
            content: `Failed to hide '${user}' from music activity. Please try again later.`,
            flags: MessageFlags.Ephemeral
        })
    }

    const hidden = verdict.action === 'inserted'
    const embed = new EmbedBuilder()
        .setTitle('🐝 Music 🐝')
        .setDescription(`Successfully ${hidden ? 'hid' : 'revealed'} user ${user} in activity monitor.`)
        .setColor("#fd8738")
        .setTimestamp()

    await message.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
}
