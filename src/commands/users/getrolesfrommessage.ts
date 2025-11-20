import config from '#config'
import type { Roles } from '#interfaces'
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Role,
    MessageFlags
} from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('getrolesfrommessage')
    .setDescription('Get the roles from a role message by message ID')
    .addStringOption((option) => option
        .setName('id')
        .setDescription('ID of the message to get roles from')
        .setRequired(true)
    )

export async function execute(interaction: ChatInputCommandInteraction) {
    const isAllowed = (interaction.member?.roles as unknown as Roles)?.cache.some((role: Role) => role.id === config.roleID)

    if (!isAllowed) {
        return await interaction.reply({
            content: 'Unauthorized.',
            flags: MessageFlags.Ephemeral
        })
    }

    const messageID = interaction.options.getString('id', true)

    const message = await interaction.channel?.messages.fetch(messageID)
    if (!message) {
        return await interaction.reply({
            content: `Message with ID ${messageID} not found.`,
            flags: MessageFlags.Ephemeral
        })
    }

    const embed = message.embeds[0]
    if (!embed || !embed.data.fields || embed.data.fields.length === 0) {
        return await interaction.reply({
            content: 'No embed or fields found in the message.',
            flags: MessageFlags.Ephemeral
        })
    }

    const title = embed.data.title || ''
    const description = embed.data.fields[0].name || ''
    const value = embed.data.fields[0].value

    const lines = value.split('\n')
    const roles: string[] = []
    const icons: string[] = []

    for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length >= 2) {
            const icon = parts.slice(0, -1).join(' ')
            const roleID = parts[parts.length - 1]
            icons.push(icon)
            roles.push(roleID)
        }
    }

    if (roles.length === 0) {
        return await interaction.reply({
            content: 'No roles found in the message.',
            flags: MessageFlags.Ephemeral
        })
    }

    const rolesString = roles.join(' ')
    const iconsString = icons.join(' ')

    const commandString = `/updaterolemessage title:${title} description:${description} roles:${rolesString} icons:${iconsString} id:${messageID}`

    await interaction.reply({
        content: `\`\`\`\n${commandString}\n\`\`\``
    })
}