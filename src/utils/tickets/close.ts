import { 
    ActionRowBuilder,  
    ButtonInteraction, 
    CategoryChannel, 
    StringSelectMenuBuilder, 
    TextChannel 
} from "discord.js"
import { getTickets } from "./ticket.js"
import formatChannelName from "./format.js"

export async function handleCloseTicket(interaction: ButtonInteraction) {
    const guild = interaction.guild

    if (guild === null) {
        return
    }

    const currentChannel = interaction.channel as TextChannel
    const ticketIdPattern = /^ticket\d+$/

    // Checks if the current channel name fits the ticket ID scheme
    if (ticketIdPattern.test(currentChannel.name)) {
        try {
            // Fetches "archived-tickets" category
            const archive = guild?.channels.cache.find(c => c instanceof CategoryChannel && c.name === "archived-tickets") as CategoryChannel
        
            if (!archive) {
                return await interaction.reply({
                    content: `Could not find "archived-tickets" category.`,
                    ephemeral: true,
                })
            }
        
            // Moves the channel to the "archived-tickets" category
            await currentChannel.setParent(archive.id, { lockPermissions: false })
        
            // Removes the user from the channel
            await currentChannel.permissionOverwrites.edit(interaction.user.id, {
                ViewChannel: false,
            })

            // Removes all roles from the channel
            const roles = currentChannel.guild.roles.cache.filter(role => role.id !== currentChannel.guild.id)
            roles.forEach(async (role) => {
                await currentChannel.permissionOverwrites.edit(role.id, {
                    ViewChannel: false,
                })
            })

            const members = currentChannel.guild.members.cache.filter(member => member.id !== interaction.user.id)
            members.forEach(async (member) => {
                await currentChannel.permissionOverwrites.edit(member.id, {
                    ViewChannel: false,
                })
            })
        
            // Lets the user know that the ticket has been archived
            await interaction.reply({
                content: `Closed by ${interaction.user.username}.`,
            })
        } catch (error) {
            await interaction.reply({
                content: 'There was an error closing the ticket. Please try again later.',
                ephemeral: true,
            })
        }
    } else {
        // Fetch all text channels that the user has access to
        const options = await getTickets(interaction)

        // Create a channel select menu for choosing a channel
        const selectChannel = new StringSelectMenuBuilder()
            .setCustomId('close_ticket_selected')
            .setPlaceholder('Select a ticket to close')
            .addOptions(options)

        // Create an action row that holds the select menu
        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectChannel)

        // Send the message with the select menu
        await interaction.reply({
            content: 'Choose a ticket to close:',
            components: [actionRow],
            ephemeral: true,
        })
    }
}

export async function handleCloseSelectedTicket(interaction: ButtonInteraction) {
    const guild = interaction.guild
    if (!guild) {
        return await interaction.reply({
            content: "Guild not found.",
            ephemeral: true,
        })
    }

    const channels = guild.channels.cache

    try {
        // Get the selected channel from interaction.customId (assuming it contains the channel ID)
        // @ts-expect-error
        const selectedChannel = channels.get(interaction.values[0]) as TextChannel | undefined
        if (!selectedChannel || !(selectedChannel instanceof TextChannel)) {
            return await interaction.reply({
                content: `Could not find the specified channel.`,
                ephemeral: true,
            })
        }

        // Get the "archived-tickets" category
        const archiveCategory = guild.channels.cache.find(
            c => c instanceof CategoryChannel && c.name === "archived-tickets"
        ) as CategoryChannel | undefined

        if (!archiveCategory) {
            return await interaction.reply({
                content: `Could not find the "archived-tickets" category.`,
                ephemeral: true,
            })
        }

        // Move the channel to the "archived-tickets" category
        await selectedChannel.setParent(archiveCategory.id, { lockPermissions: false })

        // Remove the user's permission to view the channel
        await selectedChannel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: false,  // Removes the user's ability to see the channel
        })

        // Sends a message to the ticket that it was closed
        await selectedChannel.send({
            content: `Closed by ${interaction.user.username}.`
        })

        // Send a confirmation message to the user who closed the ticket
        await interaction.reply({
            content: `${formatChannelName(selectedChannel.name)} closed.`,
            ephemeral: true
        })

    } catch (error) {
        console.error(`Failed to close the ticket: ${error}`)
        await interaction.reply({
            content: 'There was an error closing the ticket. Please try again later.',
            ephemeral: true,
        })
    }
}