import { ActionRowBuilder, PermissionsBitField, StringSelectMenuBuilder, TextChannel, } from "discord.js";
import { ticketIdPattern } from "../../../constants.js";
import formatChannelName from "./format.js";
export default async function handleViewTicket(interaction) {
    // Fetch all text channels that the user has access to
    const guild = interaction.guild;
    const channels = guild.channels.cache
        .filter(channel => channel instanceof TextChannel && // Only consider text channels
        ticketIdPattern.test(channel.name) && // Match ticket ID scheme
        channel.permissionsFor(interaction.user)?.has(PermissionsBitField.Flags.ViewChannel));
    // Map the filtered channels to select menu options
    const options = channels.map((channel) => ({
        label: channel.name,
        value: formatChannelName(channel.id),
    }));
    if (options.length === 0) {
        // If no channels are available, send a message saying so
        await interaction.reply({
            content: 'You have no open tickets to view.',
            ephemeral: true,
        });
        return;
    }
    // Create a channel select menu for choosing a channel
    const selectChannel = new StringSelectMenuBuilder()
        .setCustomId('view_ticket_command')
        .setPlaceholder('Select the ticket you want to view.')
        .addOptions(options);
    // Create an action row that holds the select menus
    const channel = new ActionRowBuilder().addComponents(selectChannel);
    // Send the message with the select menus (Pokémon and channel selection)
    await interaction.reply({
        components: [channel],
        ephemeral: true
    });
}