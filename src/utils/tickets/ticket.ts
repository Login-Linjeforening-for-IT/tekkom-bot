import { 
    BaseGuildTextChannel, 
    ButtonInteraction, 
    Guild, 
    MessageFlags, 
    PermissionsBitField, 
    TextChannel 
} from "discord.js"
import { ticketIdPattern } from "../../constants.ts"
import formatChannelName from "./format.ts"

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
                // Only considers text channels
                channel instanceof TextChannel &&
                // Match ticket ID scheme
                ticketIdPattern.test(channel.name) &&
                channel.permissionsFor(interaction.user)?.has(PermissionsBitField.Flags.ViewChannel) &&
                !(channel.parent && channel.parent.name.toLowerCase().includes('archive'))
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

export async function getArchivedTickets(interaction: ButtonInteraction) {
    const guild = interaction.guild as Guild
    const channels = guild.channels.cache
            .filter(channel => 
                channel instanceof TextChannel &&  // Only consider text channels
                ticketIdPattern.test(channel.name) &&  // Match ticket ID scheme
                (channel.parent && channel.parent.name.toLowerCase().includes('archive'))
            ) as any

        // Map the filtered channels to select menu options
        const options = channels.map((channel: BaseGuildTextChannel) => ({
            label: `${formatChannelName(channel.name)} - ${channel.topic}`,
            value: channel.id,
        }))

        if (options.length === 0) {
            // If no channels are available, send a message saying so
            await interaction.reply({
                content: 'You have no archived tickets.',
                flags: MessageFlags.Ephemeral
            })
            return
        }
    
    return options
}
