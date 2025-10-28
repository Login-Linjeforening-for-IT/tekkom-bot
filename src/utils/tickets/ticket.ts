import {
    AutocompleteInteraction,
    BaseGuildTextChannel,
    ButtonInteraction,
    Guild,
    MessageFlags,
    PermissionsBitField,
    TextChannel
} from 'discord.js'
import { ticketIdPattern } from '#constants'
import formatChannelName from '#utils/tickets/format.ts'

export default async function isTicketChannel(interaction: ButtonInteraction): Promise<boolean> {
    const channel = interaction.channel as TextChannel
    const ticketChannel = ticketIdPattern.test(channel.name)

    if (!ticketChannel) {
        await interaction.reply({
            content: 'This command can only be used in ticket channels.\nUse /view to view your tickets.',
            flags: MessageFlags.Ephemeral
        })

        return false
    }

    return true
}

export async function getTickets(interaction: ButtonInteraction) {
    const guild = interaction.guild as Guild
    const channels = guild.channels.cache
        .filter(channel =>
            channel instanceof TextChannel &&
                ticketIdPattern.test(channel.name) &&
                channel.permissionsFor(interaction.user)?.has(PermissionsBitField.Flags.ViewChannel) &&
                !(channel.parent && channel.parent.name.toLowerCase().includes('archive'))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any

    // Map the filtered channels to select menu options
    const options = channels.map((channel: BaseGuildTextChannel) => ({
        label: `${formatChannelName(channel.name)} - ${channel.topic}`,
        value: channel.id,
    }))

    if (options.length === 0) {
        // If no channels are available, send a message saying so
        await interaction.reply({
            content: 'You have no open tickets.',
            flags: MessageFlags.Ephemeral
        })
        return
    }

    return options
}

export async function getArchivedTickets(interaction: AutocompleteInteraction<'cached'> | ButtonInteraction): Promise<TicketOption[]> {
    const guild = interaction.guild as Guild
    const channels = guild.channels.cache
        .filter(channel =>
            channel instanceof TextChannel &&
                ticketIdPattern.test(channel.name) &&
                (channel.parent && channel.parent.name.toLowerCase().includes('archive'))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any

    // Map the filtered channels to select menu options
    const options = channels.map((channel: BaseGuildTextChannel) => ({
        label: `${formatChannelName(channel.name)} - ${channel.topic}`,
        value: channel.id,
    }))

    return options
}
