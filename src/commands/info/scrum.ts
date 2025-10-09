import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('scrum')
    .setDescription('Reply to someone with scrum information')
    .addUserOption(option => 
        option.setName('user')
            .setDescription('The user to reply to')
            .setRequired(true)
    )

export async function execute(message: ChatInputCommandInteraction) {
    const user = message.options.getUser('user')

    if (!user) {
        await message.reply({ content: 'Please specify a user to reply to!', ephemeral: true })
        return
    }

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('/issue Command')
        .setDescription('The `/issue` command helps you create, view, and manage issues in repositories directly from Discord.')
        .addFields([
            {
                name: 'Create an Issue',
                value: '/issue repository:<name> title:<title> description:<description> type:<type> projecttype:<group>',
            },
        ])

    await message.reply({
        content: `${user}`,
        embeds: [embed]
    })
}
