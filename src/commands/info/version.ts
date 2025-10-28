import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import packagejson from '#package' with { type: 'json' }

const { version } = packagejson

export const data = new SlashCommandBuilder()
    .setName('version')
    .setDescription(`Current version of the bot. (v${version})`)
export async function execute(message: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle(`Version ${version}`)
        .setColor('#fd8738')
        .setTimestamp()
    await message.reply({ embeds: [embed]})
}
