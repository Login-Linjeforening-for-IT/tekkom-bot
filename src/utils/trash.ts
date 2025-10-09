import { ButtonInteraction, GuildMember, MessageFlags, Role } from "discord.js"
import config from "#config"

export default async function trash(interaction: ButtonInteraction) {
    const member = interaction.member as GuildMember
    const isAllowed = member.roles.cache.some((role: Role) => role.id === config.roleID)
    if (!isAllowed) {
        return await interaction.reply({ content: "Unauthorized.", flags: MessageFlags.Ephemeral })
    }
    await (interaction as ButtonInteraction).message.delete()
}
