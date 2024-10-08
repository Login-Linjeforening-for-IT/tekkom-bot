import { OverwriteType } from "discord.js";
export default async function manageUsers(interaction, ping, remove) {
    try {
        // Check if interaction has already been deferred
        if (!interaction.deferred) {
            await interaction.deferUpdate();
        }
        // Get the channel where the users should be added
        const channel = interaction.channel;
        // Assuming interaction is of type RoleSelectMenuBuilder
        // @ts-expect-error
        const selectedUsers = interaction.values;
        if (selectedUsers.length === 0) {
            throw new Error('No users selected.');
        }
        // Fetch the users from the guild
        const guild = interaction.guild;
        if (!guild) {
            throw new Error('Guild not found.');
        }
        const users = await Promise.all(selectedUsers.map((userId) => guild.members.fetch(userId).catch(() => null)));
        const alreadyAddedUsers = channel.permissionOverwrites.cache.filter((overwrite) => overwrite.type === OverwriteType.Member).map((overwrite) => overwrite.id);
        const validUsers = users.filter((user) => user !== null && !alreadyAddedUsers.includes(user.id));
        if (validUsers.length >= 25 && remove !== true) {
            // @ts-expect-error
            await interaction.channel?.send({
                content: `<@${interaction.user.id}> you can max add 25 users to a ticket at once.`,
            });
        }
        // Update channel permissions based on the users
        const permissionOverwrites = channel.permissionOverwrites;
        const permission = remove ? false : true;
        for (const member of validUsers) {
            await permissionOverwrites.edit(member, {
                ViewChannel: permission,
                SendMessages: permission,
                AddReactions: permission,
                UseExternalEmojis: permission,
                ReadMessageHistory: permission,
            });
        }
        // Get the category of the channel and update its permissions
        const category = channel.parent;
        if (category) {
            const categoryOverwrites = category.permissionOverwrites;
            for (const member of validUsers) {
                await categoryOverwrites.edit(member, {
                    ViewChannel: permission,
                });
            }
        }
        const content = remove
            // @ts-expect-error
            ? `${interaction.user.username} removed ${validUsers.map((users) => users.user.username).join(', ')} from the ticket.`
            // @ts-expect-error
            : `${interaction.user.username} added ${validUsers.map((users) => ping === undefined ? `<@${users.id}>` : users.user.username).join(', ')} to the ticket.`;
        // @ts-expect-error
        interaction.channel?.send({ content });
    }
    catch (err) {
        const error = err;
        // Handle errors appropriately
        if (error.name === 'InteractionAlreadyReplied') {
            console.warn('Interaction has already been replied to or deferred.');
        }
        else {
            console.error('Failed to update permissions:', error);
        }
    }
}
