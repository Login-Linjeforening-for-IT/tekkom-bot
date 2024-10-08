import { PermissionsBitField, TextChannel } from "discord.js";
import { ticketIdPattern } from "../../../constants.js";
import formatChannelName from "./format.js";
export default async function isTicketChannel(interaction) {
    const channel = interaction.channel;
    const ticketChannel = ticketIdPattern.test(channel.name);
    if (!ticketChannel) {
        await interaction.reply({
            content: 'This command can only be used in ticket channels.\nUse /view to view your tickets.',
            ephemeral: true,
        });
        return false;
    }
    return true;
}
export async function getTickets(interaction) {
    const guild = interaction.guild;
    const channels = guild.channels.cache
        .filter(channel => 
    // Only considers text channels
    channel instanceof TextChannel &&
        // Match ticket ID scheme
        ticketIdPattern.test(channel.name) &&
        channel.permissionsFor(interaction.user)?.has(PermissionsBitField.Flags.ViewChannel) &&
        !(channel.parent && channel.parent.name.toLowerCase().includes('archive')));
    // Map the filtered channels to select menu options
    const options = channels.map((channel) => ({
        label: `${formatChannelName(channel.name)} - ${channel.topic}`,
        value: channel.id,
    }));
    if (options.length === 0) {
        // If no channels are available, send a message saying so
        await interaction.reply({
            content: 'You have no open tickets.',
            ephemeral: true,
        });
        return;
    }
    return options;
}
export async function getArchivedTickets(interaction) {
    const guild = interaction.guild;
    const channels = guild.channels.cache
        .filter(channel => channel instanceof TextChannel && // Only consider text channels
        ticketIdPattern.test(channel.name) && // Match ticket ID scheme
        (channel.parent && channel.parent.name.toLowerCase().includes('archive')));
    // Map the filtered channels to select menu options
    const options = channels.map((channel) => ({
        label: `${formatChannelName(channel.name)} - ${channel.topic}`,
        value: channel.id,
    }));
    if (options.length === 0) {
        // If no channels are available, send a message saying so
        await interaction.reply({
            content: 'You have no archived tickets.',
            ephemeral: true,
        });
        return;
    }
    return options;
}
