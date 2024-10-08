import { 
    ButtonInteraction, 
    CategoryChannel, 
    OverwriteType, 
    PermissionOverwriteManager, 
    Role, 
    TextChannel 
} from "discord.js"

export default async function manageRoles(interaction: ButtonInteraction, ping?: false, remove?: true) {
    try {
        // Check if interaction has already been deferred
        if (!interaction.deferred) {
            await interaction.deferUpdate()
        }

        // Get the channel where the roles should be added
        const channel = interaction.channel as TextChannel

        // Assuming interaction is of type RoleSelectMenuBuilder
        // @ts-expect-error
        const selectedRoles = interaction.values

        if (selectedRoles.length === 0) {
            throw new Error('No roles selected.')
        }

        // Fetch the roles from the guild
        const guild = interaction.guild
        if (!guild) {
            throw new Error('Guild not found.')
        }

        const possibleRoles = await Promise.all(selectedRoles.map((roleId: string) => guild.roles.fetch(roleId).catch(() => null)))
        const alreadyAddedRoles = channel.permissionOverwrites.cache.filter((overwrite) => 
            overwrite.type === OverwriteType.Role).map((overwrite) => overwrite.id)
        const validRoles = possibleRoles.filter((role: Role | null) => 
            (role !== null 
                && role.members.size <= 25 
                && (remove 
                    ? alreadyAddedRoles.includes(role.id) 
                    : !alreadyAddedRoles.includes(role.id))
            )
        ) as Role[]
        const totalMembers = validRoles.reduce((acc: number, role: Role) => acc + role.members.size, 0)

        if ((!validRoles.length || totalMembers >= 25) && remove !== true) {
            if (ping === false) {
                // @ts-expect-error
                return interaction.channel?.send({
                    content: `The role${validRoles.length > 1 ? 's you selected are' : ' you selected is'} not allowed in tickets.`,
                })
            } else {
                // @ts-expect-error
                return interaction.channel?.send(`<@${interaction.user.id}> the role${possibleRoles.length > 1 ? 's you selected have' : ' you selected has'} too many members to be pinged. Try \`/addviewer\` instead to add without pinging.`)
            }
        }

        // Get the category of the channel and update its permissions
        const category = channel.parent as CategoryChannel
        if (category) {
            const categoryOverwrites = category.permissionOverwrites as PermissionOverwriteManager

            for (const role of validRoles) {
                if (remove !== true) {
                    // Adds the role to the category
                    await categoryOverwrites.edit(role, {
                        ViewChannel: true
                    })

                    // Adds the role to the channel
                    await channel.permissionOverwrites.edit(role, {
                        ViewChannel: true,
                        SendMessages: true,
                        AddReactions: true,
                        UseExternalEmojis: true,
                        ReadMessageHistory: true,
                    })
                } else {
                    // Fetche the bot to avoid removing the bot
                    const bot = guild.members.me

                    if (bot?.roles.cache.has(role.id)) return
            
                    const permissionOverwrites = channel.permissionOverwrites.cache.get(role.id)
                    if (permissionOverwrites) {
                        // Remove the permission overwrite for the role only if it exists
                        await channel.permissionOverwrites.delete(role.id)
                    }
                }
            }
        }

        const roleObjects = await Promise.all(
            await selectedRoles.map((roleId: string) => guild?.roles.fetch(roleId).catch(() => null))
        )
        const roleStrings = roleObjects.map((role: Role | null) => role?.name)
        const roles = ping === undefined ? validRoles.join(', ') : roleStrings.join(', ')

        const content = remove 
            ? `${interaction.user.username} removed ${roleStrings.join(', ')} from the ticket.`
            : `${interaction.user.username} added ${roles} to the ticket.`
        // @ts-expect-error
        interaction.channel?.send({content})

    } catch (err) {
        const error = err as Error

        // Handle errors appropriately
        if (error.name === 'InteractionAlreadyReplied') {
            console.warn('Interaction has already been replied to or deferred.')
        } else {
            console.error('Failed to update permissions:', error)
        }
    }
}
